Release notes
-------------
##### 11.0.0 (2023-04-29)
 * Add an icon to download directory images

##### 10.0.2 (2023-04-24)
 * [Docker] Fix: ADD_TAKEN_DATE_ON_THUMBNAILS always true

##### 10.0.1 (2023-04-24)
 * Fix: Keyboard key 'i' doesn't work on login page

##### 10.0.0 (2022-07-29)
 * Level up action drives parent thumbnail view to jump to item of current view

##### 9.1.0 (2022-07-22)
 * Directory thumbnail images are lazy loading

##### 9.0.0 (2022-07-20)
 * Thumbnail images are lazy loading

##### 8.3.0 (2022-06-29)
 * Display next image after deleted one instead of parent directory

##### 8.2.0 (2022-06-03)
 * Taken date/time can be displayed on thumbnails

##### 8.1.0 (2022-05-21)
 * Use 'i' keyboard touch to toggle image info

##### 8.0.0 (2022-05-20)
 * Update to support ids-backend 6.0.0
 * Add image taken date and time info

##### 7.1.0 (2022-05-07)
 * [Preview image] Use getImage GraphQL query instead of list one

##### 7.0.4 (2022-04-25)
 * Fix: Downloaded image name was suffixed by character: '_'

##### 7.0.3 (2022-04-23)
 * Fix: Wait spinner on directory not centered

##### 7.0.2 (2022-04-20)
 * [Docker] Fix: Missing default values for variables: IS_PUBLIC_SHARING and REMOVE_DIRECTORY_PREFIX

##### 7.0.1 (2022-04-19)
 * Fix: Missing double quotes for Docker REMOVE_DIRECTORY_PREFIX variable

##### 7.0.0 (2022-04-19)
 * Directory prefix can be removed using a regular expression

##### 6.6.0 (2022-04-08)
 * Minimize gutter space between image thumbnails

##### 6.5.3 (2022-04-07)
 * Fix: Broken image preview

##### 6.5.2 (2022-04-07)
 * Fix: Directory thumbnail preview can be lesser than footer

##### 6.5.1 (2022-04-06)
 * Fix: Directory thumbnail preview can be lesser than footer on window resize

##### 6.5.0 (2022-03-19)
 * Display spinner waiting server response

##### 6.4.0 (2022-03-18)
 * Display navigation icons for public sharing

##### 6.3.0 (2022-03-17)
 * Remove maximum size constraint on password field from login page

##### 6.2.0 (2022-03-14)
 * Display cursor as pointer on delete icon

##### 6.1.1 (2022-03-13)
 * Fix: Button tag used for delete feature is displayed

##### 6.1.0 (2022-03-09)
 * Use delete key to ask to delete an image

##### 6.0.0 (2022-03-07)
 * Add administrator delete image feature

##### 5.3.0 (2021-12-31)
 * Build Docker image for Linux ARM v7

##### 5.2.0 (2021-10-05)
 * Remove home icon from home page

##### 5.1.2 (2021-09-29)
 * Remove cache on GraphQL queries

##### 5.1.1 (2021-09-28)
 * Fix: Vertical scrollbar missing on thumbnail gallery preview

##### 5.1.0 (2021-09-24)
 * Remove scrollbars (on image gallery preview)

##### 5.0.0 (2021-09-10)
 * Add user menu to access to change password page

##### 4.4.0 (2021-09-09)
 * Add hidden password change page

##### 4.3.0 (2021-08-22)
 * Use arrow up to preview level up directory

##### 4.2.0 (2021-08-20)
 * Improve preview image arrows visibility

##### 4.1.0 (2021-08-09)
 * Add transparency on breadcrumb menu
 * Navigation menu stays stick on the top

##### 4.0.0 (2021-08-03)
 * Replace left arrow by level up icon
 * Add breadcrumb menu in navigation bar on directory and image name 
 * Add navigation bar icon to download image

##### 3.5.0 (2021-07-30)
 * Add eye button to display password on login page

##### 3.4.0 (2021-07-22)
 * Use favicon as iOS home screen icon

##### 3.3.0 (2021-07-22)
 * Redirect to gallery from login page if already authenticated

##### 3.2.1 (2021-07-17)
 * Include Font Awesome using NPM

##### 3.2.0 (2021-07-16)
 * Preload previous and next preview images

##### 3.1.0 (2021-07-15)
 * Add wait spinner on thumbnail and preview image loading

##### 3.0.0 (2021-07-12)
 * Define a custom color identity

##### 2.1.2 (2021-06-27)
 * Fix: No default value for SHARING_TITLE Docker environment variable

##### 2.1.1 (2021-06-25)
 * Fix: Preview landscape image

##### 2.1.0 (2021-06-24)
 * Maximize image preview without image distortion
 * Fix: Gallery preview image alternate name set to undefined
 * Fix: Left arrow in navigation bar come back one level too more when an image is previewed
 * Fix: Image preview at root level

##### 2.0.0 (2021-06-20)
 * Add image gallery preview with keyboard and touch screen support
 * Change gallery navigation bar to be mobile first
 * Add hyperlink on navigation bar image name to download high resolution image
 * Replace texts in navigation bar by icons
 * Set application favicon
 * Add configurable image directory sharing title

##### 1.0.2 (2021-01-29)
 * Fix: Docker container environment variables evaluation

##### 1.0.1 (2021-01-27)
 * Fix: Docker container fails to start

##### 1.0.0 (2020-12-21)
 * Release IDS frontend Zip and Docker image
