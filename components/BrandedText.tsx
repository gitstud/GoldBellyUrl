import * as React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';

export const BrandedText = (props: TextProps & {text: string}) => {
  return (
    <Text {...props} style={[styles.textStyle, props.style]}>
      {props.text}
    </Text>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: '#181818',
    fontSize: 18,
  },
});
