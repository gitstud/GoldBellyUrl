import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Image,
  View,
} from 'react-native';
import {QueryClient, QueryClientProvider} from 'react-query';
import {NeuView} from 'react-native-neu-element';
import {LinksList} from './components/LinksList';
import {BrandedText} from './components/BrandedText';
import {CreateLink} from './components/CreateLink';
import {NeuButton} from 'react-native-neu-element';
import {BlurView} from '@react-native-community/blur';

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [formIsOpen, setFormIsOpen] = React.useState(false);
  const handleSetFormIsOpen = () => setFormIsOpen(state => !state);
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={{paddingBottom: 30, paddingTop: 15}}>
          <NeuView
            color="#eef2f9"
            height={150}
            width={150}
            borderRadius={75}
            convex>
            <Image
              source={require('./assets/logo.png')}
              style={{height: 140, width: 140, borderRadius: 70}}
              resizeMode="contain"
              capInsets={{left: 15, right: 15, bottom: 15, top: 15}}
            />
          </NeuView>
        </View>
        <LinksList />
        {formIsOpen ? (
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white">
            <CreateLink cancel={handleSetFormIsOpen} />
          </BlurView>
        ) : (
          <View style={styles.createButton}>
            <NeuButton
              width={50}
              height={50}
              color="#eef2f9"
              borderRadius={16}
              onPress={handleSetFormIsOpen}>
              <BrandedText text="+" style={styles.createButtonText} />
            </NeuButton>
          </View>
        )}
      </SafeAreaView>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  backgroundStyle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#eef2f9',
  },
  title: {
    fontSize: 30,
    paddingVertical: 30,
  },
  createButton: {
    position: 'absolute',
    right: 25,
    bottom: 55,
  },
  createButtonText: {
    fontSize: 24,
    color: '#FE53BB',
  },
});

export default App;
