// import AppStack from '../features/chats/AppStack'

// export class AppMap<K, V> {
//   private readonly keyMap: Map<string, K> = new Map()
//   private readonly valueMap: Map<string, AppStack<{ key: object; value: V }>> =
//     new Map()
//   constructor(conversation: AppMap<K, V>) {
//     if (conversation != null) {
//       this.valueMap = conversation.valueMap
//       this.keyMap = conversation.keyMap
//     }
//   }
//   public getValueMap() {
//     return this.valueMap
//   }
//   public getKeyMap() {
//     return this.keyMap
//   }
//   /**
//    * Add a key-value pair to the map
//    * If the key exists, it will update the value
//    */
//   set(key: object, value: V): void {
//     this.valueMap.set(key.identifier, value)
//     this.keyMap.set(key.identifier, key)
//   }
//   entries() {
//     return this.valueMap.entries()
//   }
//   /**
//    * Get the value for a given key
//    */
//   get(key: object) {
//     if(key== null)
//     {
//       return null;    
//     }
//     return this.valueMap.get(key.identifier)
//   }

//    size()
//    { 
//     return this.valueMap.size;
//    }
// }
