import * as React from 'react';
import {Easing, ScrollView, StyleSheet, View} from 'react-native';
import {NeuSpinner} from 'react-native-neu-element';

import {useLinks} from '../hooks/links';
import {NeuLink} from './NeuLink';

export const LinksList = () => {
  const {data, isLoading, isSuccess} = useLinks();
  if (isLoading) {
    return (
      <NeuSpinner
        color="#eef2f9"
        size={150}
        indicatorColor="#aaffc3" // Mint
        duration={1000}
        easingType={Easing.linear}
      />
    );
  }
  if (isSuccess) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}>
        {data?.map(url => (
          <NeuLink url={url} />
        ))}
        <View style={styles.scrollPadding} />
      </ScrollView>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  scrollPadding: {
    height: 60,
  },
});
