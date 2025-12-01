# Hooksie

Hooksie is a lightweight communication system that combines the simplicity of events and control of observables.

## Features

- "Scopes" to group hooks in a specific part of the code
- Callbacks ordering
- Hooks monitoring & debug tools
- All callbacks for a hook guaranteed to be called, even if one fails

## Getting started

Install the package:

```
npm i hooksie
```

---

Example script:

```ts
import Hooksie from 'hooksie';

// Create a new scope, which contains hooks
const scope = Hooksie.scope('demoScope');

// Create hooks with specific type argument (TypeScript)
const sendInfoHook = scope.hook<string>('sendInfo');
const updateScoreHook = scope.hook<number>('updateScore');

// Example callback for the "sendInfo" hook
function handleSendInfo(info: string) {
  console.log('Send info:', info);
}

// Example callback for the "updateScore" hook
function handleUpdateScore(info: number) {
  console.log('Update score:', info);
}

// Use fasten() function to register callbacks
const sendInfoHandle = sendInfoHook.fasten(handleSendInfo);
updateScoreHook.fasten(handleUpdateScore);

// Invoke hook callbacks
sendInfoHook.invoke('info');
updateScoreHook.invoke(100);

// Detach a callback using its handle
sendInfoHandle.detach();
// Detach a callback directly from a hook
updateScoreHook.detach(handleUpdateScore);
```

## Documentation

### Naming

- ***Hook***: a named communication channel (you could call it an event) to which callbacks can be attached
- ***Scope***: a group of *Hooks*. You can use scopes to organize and encapsulate hooks in specific parts of your code

### API

#### Types

```ts
type HookCallback<T> = ((arg: T) => any) | ((arg: T) => Promise<any>);
```

#### `Hooksie`

- `static scope(name?: string): HookScope`: Create a new scope
- `static hook<T>(name: string): Hook<T>`: Create a new hook in the default scope
- `static fasten<T, U extends HookCallback<T>>(hookName: string, callback: U, order?: number): HookHandle<T>`: Register a callback to a named hook in the default scope
- `static detach<T, U extends HookCallback<T>>(callback: U): boolean`: Remove a callback from all hooks in the default scope
- `static detach<T, U extends HookCallback<T>>(hookName: string, callback: U): boolean`: Remove a callback from the named hook in the default scope

#### `HooksScope`

- `get name(): string | undefined`: Get the name of this scope
- `hook<T>(name?: string): Hook<T>`: Create a new hook in this scope
- `fasten<T, U extends HookCallback<T>>(callback: U, order?: number): HookHandle<T>`: Register a callback to a named hook in this scope
- `detach<T, U extends HookCallback<T>>(callback: U): boolean`: Remove a callback from all hooks in this scope
- `detach<T, U extends HookCallback<T>>(hookName: string, callback: U): boolean`: Remove a callback from the named hook in this scope

#### `Hook<T>`

- `get name(): string`: Get the name of this hook
- `fasten<U extends HookCallback<T>>(callback: U, order?: number): HookHandle<T>`: Register a callback to this hook
- `detach<U extends HookCallback<T>>(callback: U): boolean`: Remove a callback from this hook
- `invoke(arg: T): Promise<boolean>`: Invoke all the callbacks in this hook, and returns `true` if all the callbacks have been called successfully
- `invokeSync(arg: T): boolean`: Invoke all the callbacks in this hook, and returns `true` if all the callbacks have been called successfully

#### `HookHandle<T>`

- `get id(): number`: Get the unique id of this handle
- `get isAsync(): boolean`: Check if the related callback is an `async` function
- `get order(): number`: Get the order value of the related callback in its owning hook.
- `set order(order: number)`: Set the order value of the related callback in its owning hook. The lower the value, the first.

## Get Help

If you need help or just want to chat with the community and the *Sideways Experiments* core team, you're welcome to join our [Discord server](https://discord.gg/bMK2d47JaE)!

## Contributing

Do you want to get involved in our projects? Check the [CONTRIBUTING.md](./.github/CONTRIBUTING.md) file to learn more!

## License

This project is licensed under the [MIT License](./LICENSE.md).

---

Crafted and maintained with love by [Sideways Experiments](https://sideways-experiments.com)

(c) 2022-2025 Sideways Experiments