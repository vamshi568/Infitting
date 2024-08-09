import { View, Text } from 'react-native'
import React from 'react'
import { CreateProfile } from '../../components/helpers'
import { useLocalSearchParams } from 'expo-router';

const ProfileEdit = () => {
    const { profile_id } = useLocalSearchParams();

  return (
    <CreateProfile create={false} profileId={profile_id}/>
  )
}

export default ProfileEdit