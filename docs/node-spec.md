# Story Node
A story node describes an interaction point in a story.

## Example
```JSON
{
  "type": "node",
  "title": "Hello, Title! I don't get used!",
  "optionText": "Show me on the button, please.",
  "id": "b7e3dc84-6070-1f87-ca92-0510f63624e5",
  "fontSize": 256,
  "messages": [
    "Click here.",
    "You can add as many messages into this carousel as you'd like.",
    "They all have to display before the buttons appear."
  ],
  "children": [
    "6439a03e-955f-ea6f-4763-91f34855b5c9",
    "3c2578c4-502e-f06d-0bcb-1ad2c0948653"
  ]
}
```

## Properties

#### type `<String>`
`"node"`

#### title `<String>`
Display title for the node itself. Currently unused.

#### optionText `<String>`
Display text for the button which a user will click to arrive at this node's interaction point.

#### id `<Guid>`
An [Guid](https://npm.im/guid) which uniquely identifies this node.

#### fontSize `<Number>`
Probably to be deprecated in favor of a `style` object. Currently unused (needs confirmation).

#### messages `List[<String>]`
A series of messages to be displayed on prior to the user being presented with any choices. Currently these messages display in a carousel that the user must click through. Ideally the manner in which the messages are animated can be pluggable or at least configurable.

#### children `List[<String>]`
A list of [Guids](https://npm.im/guid) which point at existing nodes within the story. This list will be used (in conjunction with adopted links) to determine which buttons to present the user at the end of the interaction.
