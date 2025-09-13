// src/contexts/ProfileContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    name: 'User',
    email: '',
    bio: '',
    profilePicture: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [updateCount, setUpdateCount] = useState(0); // Add this to trigger re-renders

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + 'profile.json';
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      if (fileInfo.exists) {
        const data = await FileSystem.readAsStringAsync(fileUri);
        setProfileData(JSON.parse(data));
      }
    } catch (error) {
      console.log('No profile data found, using default values');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileData = async (newData) => {
    try {
      setProfileData(newData);
      setUpdateCount(prev => prev + 1);
      const fileUri = FileSystem.documentDirectory + 'profile.json';
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving profile data:', error);
      throw error;
    }
  };

  const value = {
    profileData,
    isLoading,
    updateProfileData,
    loadProfileData,
    updateCount // Export updateCount to trigger re-renders
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};