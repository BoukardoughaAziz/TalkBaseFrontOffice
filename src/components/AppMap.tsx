import AppStack from '../features/chats/AppStack'

export class AppMap<K, V> {
  private readonly keyMap: Map<string, K> = new Map()
  private readonly valueMap: Map<string, AppStack<{ key: object; value: V }>> =
    new Map()
  constructor(conversation: AppMap<K, V>) {
    if (conversation != null) {
      this.valueMap = conversation.valueMap
      this.keyMap = conversation.keyMap
    }
  }
  public getValueMap() {
    return this.valueMap
  }
  public getKeyMap() {
    return this.keyMap
  }
  /**
   * Add a key-value pair to the map
   * If the key exists, it will update the value
   */
  set(key: object, value: V): void {
    this.valueMap.set(key.identifier, value)
    this.keyMap.set(key.identifier, key)
  }
  entries() {
    return this.valueMap.entries()
  }
  /**
   * Get the value for a given key
   */
  get(key: object) {
    if(key== null)
    {
      return null;    
    }
    return this.valueMap.get(key.identifier)
  }

  /**
   * Check if the map contains the key
   */
  // has(key: object): boolean {
  //   return this.appStack.getItems().some((item) => this.isEqual(item.key, key))
  // }

  /**
   * Remove a key-value pair
   */
  // delete(key: object): boolean {
  //   const index = this.appStack
  //     .getItems()
  //     .findIndex((item) => this.isEqual(item.key, key))
  //   if (index !== -1) {
  //     this.appStack.getItems().splice(index, 1)
  //     return true
  //   }
  //   return false
  // }

  /**
   * Get all keys (as objects)
   */
  // keys(): object[] {
  //   return this.appStack.getItems().map((item) => item.key)
  // }

  /**
   * Get all values
   */
  // values(): V[] {
  //   return this.appStack.getItems().map((item) => item.value)
  // }

  /**
   * Custom equality check (deep equality using lodash)
   */
}
