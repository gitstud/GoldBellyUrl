import * as React from 'react';
import {BrandedText} from './BrandedText';
import {NeuBorderView, NeuButton} from 'react-native-neu-element';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {createLink, deleteLink, GBUrl} from '../hooks/links';
import {useMutation, useQueryClient} from 'react-query';
import {QueryKeys} from '../hooks/QueryKeys';
const {width} = Dimensions.get('screen');

interface Props {
  cancel: () => void;
  url?: GBUrl;
}

export const CreateLink = ({cancel, url}: Props) => {
  const [urlText, setUrlText] = React.useState(url?.url || '');
  const [slugText, setSlugText] = React.useState(url?.slug || '');
  const queryClient = useQueryClient();

  const saveLink = useMutation(() => createLink(urlText, slugText), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(QueryKeys.LINKS);
      cancel();
    },
  });

  const inactivateLink = useMutation(
    (keep: boolean) =>
      deleteLink(url || {url: '', slug: '', short_url: ''}, keep),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.LINKS);
      },
    },
  );

  const handleSaveLink = async () => {
    if (url) {
      inactivateLink.mutate(false);
    }
    saveLink.mutate();
  };

  const updateText = (type: 'url' | 'slug') => (text: string) => {
    switch (type) {
      case 'url':
        setUrlText(text.toLowerCase());
        break;
      case 'slug':
        setSlugText(text.toLowerCase());
        break;
    }
  };

  return (
    <NeuBorderView
      //Required
      width={width * 0.9}
      height={100}
      color={'#eef2f9'}
      //Optional
      //Specify the width of the border
      //Default: 10
      borderWidth={10}
      //Optional
      //Specify the radius of the border
      //Default: 0
      borderRadius={16}>
      <View style={styles.container}>
        <View style={styles.textColumn}>
          <View style={styles.textRow}>
            <BrandedText text="www." />
            <TextInput
              onChangeText={updateText('url')}
              value={urlText}
              placeholder="google.com..."
              autoCapitalize="none"
              autoCompleteType="off"
              style={styles.textInput}
            />
          </View>
          <View style={styles.textRow}>
            <BrandedText text="bely.me/" />
            <TextInput
              onChangeText={updateText('slug')}
              value={slugText}
              placeholder="link-name"
              autoCapitalize="none"
              autoCompleteType="off"
              style={styles.textInput}
            />
          </View>
        </View>
        <View style={styles.cancelContainer}>
          <NeuButton
            color="#eef2f9"
            width={70}
            height={40}
            borderRadius={16}
            isConvex
            onPress={handleSaveLink}>
            <BrandedText text="save" />
          </NeuButton>
          <TouchableOpacity onPress={cancel}>
            <BrandedText text="cancel" style={styles.cancelText} />
          </TouchableOpacity>
        </View>
      </View>
    </NeuBorderView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  cancelContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '90%',
  },
  textColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    height: '90%',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  textInput: {
    fontSize: 18,
  },
  cancelText: {color: 'red', fontSize: 16},
});
