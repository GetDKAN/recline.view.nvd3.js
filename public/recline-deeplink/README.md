### Recline Deeplink

Saves the current multiview state allowing to share a visualization by url.

## Requirements
* Recline multiview

**To save time we recommend to install this tools:**

* npm
* grunt
* bower

## Usage
You only have to pass a valid multiview object as value to recline.DeepLink.Router constructor.

```javascript
var router = new recline.DeepLink.Router(objectToSave);
router.start({
    init: function(state){

    },
    updateState: function(currentState, oldState){

    },
    listenTo: [],
    ignoredKeys: [],
});
```

### Constructor
Takes object you want to save as param. And optionally you could pass a second object with the initial default state you want to compute difference against to. (i.e. object state of your view without any user changes)

### init
It receives the parsed url state as parameter. Within you should run actions you need to configure how your view should be displayed.

### updateState
It receives the newState and oldState as parameter. This method is triggered everytime a tracked object change. You sould use it to update your view accordingly new state.

### listenTo
An array containing object you want to track for changes. Normally you want to track objects you save but sometimes could be useful to track objects different of you save.

### ignoredKeys
An array containing keys you don't want to save in the url. Useful when you have a key with so much data to save in the url.


## Installation

```bash
git clone https://github.com/NuCivic/recline-deeplink.git
cd recline-deeplink
bower install
npm install
```

## Run demo

```bash
grunt
```

## Lint code

```bash
grunt lint
```

## Build example

```bash
make
```

## Plugins
A plugin is a javascript constructor that currently only need two methods to manipulate the url state and
react based on that state. You can add a new plugin just calling the addDependency method of router object in this way:

```javascript
router.addDependency(new recline.DeepLink.Deps.Map(map, router));
```

To define a new plugin you have to create a javascript constructor with the update and alterState methods and a property name set to the name that you want.

The alterState method allow you to add new data in the url under a key. The key used for that purpose is the name of the plugin.

Also you have to implement the update method that will be called when the name key is detected in the url.

You can check map.dep.js plugin implementation at src directory for more details.

## TODO
* Create unit tests
* Format accordingly javacript coding standards

## Caveats
Since the state is shared through url, data edition (eg. add, delete or edit a row in the dataset) is not saved at all.
