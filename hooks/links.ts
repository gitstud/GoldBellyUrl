import axios from 'axios';
import {useQuery} from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {QueryKeys} from './QueryKeys';

const API = axios.create({
  baseURL: 'https://api.bely.me/',
  timeout: 3000,
  headers: {'GB-Access-Token': 'your-api-key-here'},
});

export interface GBUrl {
  short_url: string;
  slug: string;
  url: string;
  inactive?: boolean;
}

const responseOK = (status: number) => String(status)[0] === '2';

const fetchLinks = async () => {
  const response = await API.get<GBUrl[]>('/links');
  if (responseOK(response.status)) {
    const keptLinks = await AsyncStorage.getItem('links');
    const parsedKeptLinks = keptLinks ? JSON.parse(keptLinks) : [];
    return [...response.data, ...parsedKeptLinks].sort((a, b) => {
      if (a.slug < b.slug) {
        return -1;
      }
      if (a.slug > b.slug) {
        return 1;
      }
      return 0;
    });
  }
  throw new Error(response.statusText);
};

const fetchLink = async (slug: string) => {
  const response = await API.get<GBUrl>(`/links/${slug}`);
  if (responseOK(response.status)) {
    return response.data;
  }
  throw new Error(response.statusText);
};

export const createLink = async (url: string, slug?: string) => {
  try {
    const links = await AsyncStorage.getItem('links');
    const parsedLinks = links ? JSON.parse(links) : [];
    const keptIndex = parsedLinks.findIndex((item: GBUrl) => item.url === url);
    if (keptIndex >= 0) {
      parsedLinks.splice(keptIndex, 1);
      await AsyncStorage.setItem('links', JSON.stringify(parsedLinks));
    }
    const response = await API.post<GBUrl>('/links', {
      url,
      slug,
    });
    if (responseOK(response.status)) {
      return response.data;
    }
  } catch (err) {
    console.warn('ERR: ', err);
  }
};

export const deleteLink = async (url: GBUrl, keep: boolean) => {
  const response = await API.delete<string>(`/links/${url.slug}`);
  if (responseOK(response.status)) {
    const links = await AsyncStorage.getItem('links');
    const parsedLinks = links ? JSON.parse(links) : [];
    if (keep) {
      parsedLinks.push({...url, inactive: true});
    } else {
      const index = parsedLinks.findIndex(
        (item: GBUrl) => item.url === url.url,
      );
      if (index >= 0) {
        parsedLinks.splice(index, 1);
      }
    }
    await AsyncStorage.setItem('links', JSON.stringify(parsedLinks));
    return true;
  }
  throw new Error(response.statusText);
};

export const useLinks = () => {
  return useQuery<GBUrl[], false>([QueryKeys.LINKS], fetchLinks);
};

export const useLink = (slug: string) => {
  return useQuery<GBUrl, false>([QueryKeys.LINK, slug], () => fetchLink(slug));
};
