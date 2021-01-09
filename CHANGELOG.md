## v0.8.3

### UPDATED
- Improved Japanese localisation
- Update packages
- Slight Style changes due to updates in styling dependency package

---

## v0.8.2

### NEW FEATURES
- Add Matomo for anonymous statistics

### UPDATED
- Improve Arabic, Japanese and Turkish translations
- Update App Logo


---

## v0.8.1

### NEW FEATURES
- Add Turkish translation
- Re-add scrollbar for desktop
- Stylize scrollbar
- Highlight own user's activities
- Allow jumping to media from activity image
- Update dependencies

### FIX
- Fix season preview image not linking to details
- Hide adult content from list when set accordingly
- Fix iPad being not a mobile device

---

## v0.8.0

### NEW FEATURES

- New Navigation Drawer design
- New Settings design
- Add more AniList settings ([#74](https://github.com/NicoAiko/mikazuki/issues/74) Add changeable personal settings)
- Add Links to About page
- List Overview has been overhauled completely
- Set Score directly on overview page
- Season Preview has been overhauled completely
- Airing media has a yellow-ish progress bar now indicating its airing episode progress ([#80](https://github.com/NicoAiko/mikazuki/issues/80) [Feature Request] Episodes Progress Bar)

### FIX

- [#157](https://github.com/NicoAiko/mikazuki/issues/157) "Can't update the watched count in search results" has been temporarily fixed by removing the progress bar
- [#169](https://github.com/NicoAiko/mikazuki/issues/169) "Titles added by search aren't handled correctly" now adds the title to the planning list
- [#202](https://github.com/NicoAiko/mikazuki/issues/202) "Days Watched Progress Bar labels are incorrect" The days watched progress bar middle value on the home view now shows the correct values

### UPDATED

- Changelog is now a markdown file
- A lot of dependencies have been updated

---

## v0.7.8

### FIX

- Setting the refresh rate interval is fixed.
- Also a limit on how low or high it can be set was added.

### UPDATED

- French localisation updated

---

## v0.7.7

### FIX

- Fixes loading the detail view on media that is not present in one's own list.

---

## v0.7.6

### NEW FEATURES

- (Preview): New Home Chart View
- Rewrite AniList API call procedure
- When no activities are available, a placeholder text is shown
- Add transfer dialog to show move to mikazuki.moe

### FIX

- Handle search action easier
- Logout resets data now properly
- Media image animation in lists changed to use less space
- Back button is now only visible on certain pages
- Update Style package to latest version
- Make global refresh timer independent of user store

---

## v0.7.5

### NEW FEATURES

- Adult Content filter in Season Preview
- New Font in Japanese language setting

### FIX

- Italian & Chinese locale changes
- Paddings of settings tabs
- Season preview
- Sends access token of logged in user
- Loading animation only applies to clicked button
- Amount of items fetched via API is not 50 anymore
- Sorting menu positioning is temporarily fixed via absolute positioning

---

## v0.7.4

### NEW FEATURES

- Italian localisation added

### FIX

- Mobile perspectives
- Season Preview available in landscape view on mobile devices

---

## v0.7.3

### NEW FEATURES

- The Notification Toast now has the correct background
- A custom 5-cards-in-one-row mode depending on the user's resolution
- Season Preview now supports a direct go to a certain season and year
- Search filters are now radio buttons
- Search page now also has a "search" button (before one had to press enter in the search input field)
- Move to top button is now a blue floating button in the bottom right corner
- Studios are now added to the title cards

### FIX

- Icons and Navigation Drawer were not flipped when RTL (right-to-left) is activated
- Store wasn't ready when app was started which led to "Routes.undefined" and other problems
- Reading activities now have text

---

## v0.7.1

### HOTFIX

- Some users experienced login issues and overall unavailability.
- Fixed by waiting for store.restored to be available.

---

## v0.7.0

### NEW FEATURES

- Complete new design via Vuetify v2
- Improved search experience
- Season preview built-in
- Homepage with latest activities
- In-app visible changelog
- Filtering by Genre
- Web app replaces electron app

### FIX

- Split complete list on AniList is now fully supported
- Sorting via various parameters

### REMOVED

- Support for MyAnimeList has been terminated

