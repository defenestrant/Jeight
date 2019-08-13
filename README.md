



# Jeight
A Virtual Gamepad Keyboard Prototype
test it @ https://jeight.io/prototype

## What

Jeight.io is a prototype that hopes to be an alternative way to type sentences using your gamepad. It's closely related to the T9 keyboards found on old cellphones. But instead of using keys, you move the 2 joysticks each in 4 possible directions to type. Every direction (8 in total) is linked to a group of letters.

## Goal
The goal was to show it's possible to provide a more time-efficient way of typing with your controller. Unfortunately, there are currently no practical uses. I can not do much more than show off the fact that the prototype works. It cannot be implemented on consoles without official development from Microsoft (for Xbox) or Sony (for Playstation).

## Future development and help
If lots of people would want this for desktop games, this could possibly be implemented. However I do not currently have the skillset to do this and would greatly benefit from the help of someone more at home in the world of C++/DirectX and native game development. So if this is you, and you see a future in this project, be sure to shoot me a message. If you work for the Microsoft Xbox development team or the Sony Playstation development team, I am open for any opportunity :)

## Technical details
This repository contains the entire website of jeight.io. Publishing is done via CI/CD on the master branch.
The project (and website) are written as a Javascript/ application with a focus (as a learning experience) on functional programming. It's component based written with React and Styled-Components. Throughout the entire code-base, I make heavy use of the functional programming utility library RamdaJS and have tried to limit the amount of procedural code, unless I did not immediately find a functional solution.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.


### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
