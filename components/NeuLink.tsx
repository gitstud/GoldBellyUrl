import * as React from 'react';
import {
  ActionSheetIOS,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {BrandedText} from './BrandedText';
import {NeuButton, NeuSwitch} from 'react-native-neu-element';
import {createLink, deleteLink, GBUrl} from '../hooks/links';
import {CreateLink} from './CreateLink';
import {useMutation, useQueryClient} from 'react-query';
import {QueryKeys} from '../hooks/QueryKeys';
const {width} = Dimensions.get('screen');

export const NeuLink = ({url}: {url: GBUrl}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const queryClient = useQueryClient();

  const inactivateLink = useMutation((keep: boolean) => deleteLink(url, keep), {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.LINKS);
    },
  });

  const activateLink = useMutation(() => createLink(url.url, url.slug), {
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.LINKS);
    },
  });

  const handleSetActive = () => {
    if (url.inactive) {
      activateLink.mutate();
    } else {
      inactivateLink.mutate(true);
    }
  };

  const handlePressIn = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Edit', 'Delete'],
        destructiveButtonIndex: 4,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'light',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            return;
          case 1:
            return setIsEditing(true);
          case 2:
            return inactivateLink.mutate(false);
        }
      },
    );
  };

  const handleOnPress = () => !url.inactive && Linking.openURL(url.short_url);

  if (isEditing) {
    return (
      <View style={styles.itemStyle}>
        <CreateLink cancel={() => setIsEditing(false)} url={url} />
      </View>
    );
  }
  return (
    <View style={styles.itemStyle}>
      <NeuButton
        width={width * 0.9}
        height={100}
        color="#eef2f9"
        borderRadius={16}
        onLongPress={handlePressIn}
        onPress={handleOnPress}>
        <View style={styles.itemContentStyle}>
          <View style={styles.textContainer}>
            <BrandedText
              numberOfLines={1}
              ellipsizeMode="tail"
              text={url.slug}
              style={styles.slug}
            />
            <BrandedText
              numberOfLines={1}
              ellipsizeMode="tail"
              text={url.short_url.substr(7, url.short_url.length)}
              style={styles.shortUrl}
            />
          </View>
          <View style={styles.switchContainer}>
            <TouchableOpacity activeOpacity={1} onPress={handleSetActive}>
              <NeuSwitch
                isPressed={!url.inactive}
                setIsPressed={noop} // this callback wasn't firing for me so I used the touchableOpacity wrapper
                color="#eef2f9"
                containerHeight={30}
                containerWidth={60}
                buttonHeight={30}
                buttonWidth={35}
                customGradient={['#98FF98', '#D1FFD5']}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={handleSetActive}>
              <NeuButton
                width={60}
                height={30}
                color="#eef2f9"
                borderRadius={16}
                onPress={() => Clipboard.setString(url.short_url)}>
                <BrandedText text="copy" style={styles.textLift} />
              </NeuButton>
            </TouchableOpacity>
          </View>
        </View>
      </NeuButton>
    </View>
  );
};

const noop = () => undefined;

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemStyle: {
    paddingBottom: 30,
  },
  itemContentStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    height: '90%',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '90%',
  },
  textLift: {
    marginBottom: 2,
  },
  shortUrl: {color: '#78C5EF'},
  slug: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: 20,
  },
});
