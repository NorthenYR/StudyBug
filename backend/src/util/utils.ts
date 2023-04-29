// export function findChangedItems(list1: string[], list2: string[]): { oldItem: string, newItem: string } | number {
//     if (list1.length === 0 || list2.length === 0) {
//         return 0
//     }
    
//     const itemMap = new Map<string, number>();
//     for (const item of list1) {
//       itemMap.set(item, (itemMap.get(item) ?? 0) + 1);
//     }
//     for (const item of list2) {
//       if (!itemMap.has(item) || itemMap.get(item) === 0) {
//         const oldItem = Array.from(itemMap.keys()).find(key => (itemMap.get(key) ?? 0) < 1) as string;
//         return { oldItem, newItem: item };
//       } else {
//         itemMap.set(item, (itemMap.get(item) ?? 0) - 1);
//       }
//     }
//     return 0;
//   }

export function compareArrays(arr1: string[], arr2: string[]): { oldVal: string, newVal: string } | undefined {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return { oldVal: arr1[i], newVal: arr2[i] };
      }
    }
    return undefined;
  }
