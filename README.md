# Workflow and Timekeeping

## 1. Reading project requirements and planning

The project requirements were straightforward. The design was interesting, yet simple.
I found some sizes and spacings in the design that I thought were a bit off,
but I was still going to follow the design as closely as possible.

### 0.5h

## 2. Getting familiar with React and its ecosystem.

### 2h

I have never used React with TypeScript before.
In fact, I have tried React only once, a couple of years ago, when choosing between React, Vue and Svelte.
At that time, I chose Vue because I found React unnecessarily verbose and complex.
It's now time to give React another try.

## 3. Setting up the project

### 1h

I have been following React's developments for a few years.
I recall some discourse about using `create-react-app` or its alternatives, so I was not sure which one to use for this
assignment.

Next.js is a framework similar to Nuxt.js, which I have used before in my hobby projects.
But the scale of this project is small, so I decided to use `create-react-app` with the TypeScript template instead,
which the official React documentation still recommends.
I contemplated using Vite, but it requires a bit more configuration, and I wanted to get started painlessly.

In this stage I also added sass by running `npm install sass`, google fonts and material icons.

## 4. Implementing the UI

### 9h

Most of the UI was straightforward to implement, while quickly learning react on the way.
I decided to use functional components,
as they resemble Vue's Composition API components, which I am familiar with.

The hardest part of this assignment was creating the movie info tab. I wanted every part of the movie list to be
responsive.
I used CSS Grid for the main list. This meant that I had to figure out how to put the movie info exactly between grid
items depending on its height. For this, I used JavaScript to calculate the height of the movie info, and use it as the
selected movie poster's height, to push the next row of movies lower. This took the most time to implement.

## 5. Integrating the API

### 3h

I added an environment variable to the `.env` file to store the API Key and the API URL.

While integrating the API, I found an error in the requirements. I had to show popular movies sorted by ratings.
But I also wanted to implement the optional requirement about loading more items dynamically. I could not have both.

I opted for not sorting by rating, as I implemented dynamic loading. Had I not implemented infinite scroll,
it would have been a simple addition.

## 6. Refactoring

## 7. Testing

## 8. Summary and Afterthoughts

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will
remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right
into your project so you have full control over them. All of the commands except `eject` will still work, but they will
point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you
shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t
customize it when you are ready for it.

## Learn More

You can learn more in
the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
