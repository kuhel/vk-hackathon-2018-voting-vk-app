const deepEqual =  (a, b) => {
	if (a === b) {
		// items are identical
		return true;
	} else if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
		// items are objects - do a deep property value compare
		// join keys from both objects together in one array
		let keys = Object.keys(a).concat(Object.keys(b));
		// filter out duplicate keys
		keys = keys.filter((value, index, self)  => self.indexOf(value) === index);
		for (let p of keys) {
			if (typeof a[p] === 'object' && typeof b[p] === 'object') {
				if (deepEqual(a[p], b[p]) === false) {
					return false;
				}
			} else if (a[p] !== b[p]) {
				return false;
			}
		}
		return true;
	} else {
		return false; 
	}
}

export default deepEqual;
