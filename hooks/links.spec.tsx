import React from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import nock from 'nock';
import {renderHook} from '@testing-library/react-hooks';
import {createLink, deleteLink, useLink, useLinks} from './links';

const mockUrl = {url: '', short_url: '', slug: ''};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
});
const wrapper = ({children}: {children: React.ReactChildren}) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('links', () => {
  beforeAll(() => {
    nock('https://api.bely.me/')
      .get('/links')
      .reply(200, [mockUrl])
      .get('/links/slug')
      .reply(200, mockUrl)
      .post('/links')
      .reply(201, mockUrl)
      .delete('/links/slug')
      .reply(200, '');
  });
  it('can fetch links', async () => {
    const {result, waitFor} = renderHook(() => useLinks(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual([mockUrl]);
  });

  it('can create link', async () => {
    const result = await createLink('', '');

    expect(result).toEqual(mockUrl);
  });

  it('can fetch link by slug', async () => {
    const {result, waitFor} = renderHook(() => useLink('slug'), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockUrl);
  });
  it('can delete link by slug', async () => {
    const result = await deleteLink({...mockUrl, slug: 'slug'}, false);

    expect(result).toEqual(true);
  });
});
