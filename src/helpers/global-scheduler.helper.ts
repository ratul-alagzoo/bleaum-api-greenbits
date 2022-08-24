//Prevent performing duplicate job schedulers
export function shouldPlaceScheduler(key: string): boolean {
  try {
    const foundObject = (global as any).Schedulers;
    if (Array.isArray(foundObject)) {
      if (foundObject.includes(key.toLowerCase())) {
        return false;
      }
      (global as any).Schedulers = [...foundObject, key.toLowerCase()];
      return true;
    } else {
      (global as any).Schedulers = [key.toLowerCase()];
      return true;
    }
  } catch (e) {
    console.error(`*********Job placing key error**********`, e);
    return true;
  }
}
