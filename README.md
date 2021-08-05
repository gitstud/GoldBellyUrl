# GoldBellyUrl

GoldBelly Take Home Project

## Up & Running

1. Clone Project
2. `cd GoldBellyUrl`
3. `yarn`
4. `npx pod install`
5. open `GoldBellyUrl/ios/project.xworkspace` in XCode
6. build app
7. Add API key to `GoldBellyURL/hooks/links.ts` line 9

## Using The App

1. Create a link with the floating + button
2. Press the newly created link to open the link in your default browser
3. Deactivate the link with switch (this operation deletes the link from the api and stores it locally to your device).
4. Reactivate a link with switch (uses the local data to re-create the link in the api).
5. The copy button will copy the short url to your devices clipboard.
6. Long press a link to edit or delete
7. Deleting from the action sheet will pernamently delete the link from the api and local storage
8. Editing the link form the action sheet will allow you to edit your url and slug values in-line.

## Testing

run `yarn test` in the project to execute the test suite
I've written tests for the api calls / react-query hooks

Ideas for more features

1. UI feedback for API errors
2. Component tests or snapshots
3. Re-organize code move Colors, Configuration objects, etc to their own files.
4. ENV file for secrets
