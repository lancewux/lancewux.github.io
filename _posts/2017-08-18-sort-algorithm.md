
```javascript
const arr = [19, 1, 5, 7, 4, 3, 9, 15, 51, 7];
			console.log(arr);
			// insertSort(arr);
			// shellSort(arr);
			// selectSort(arr);			
			// heapSort(arr);
			// bubbleSort(arr);
			// quickSort(arr);
			// mergeSort(arr);
			// console.log(arr);

			// String.prototype.lent = function() {
			// 	return this.length;
			// }

			// console.log('ssss'.lent());


			function insertSort(arr) {
				console.log('insertSort');
				const len = arr.length;
				for (let i = 1; i < len; i++) {
					if(arr[i] < arr[i - 1]) {
						const tmp = arr[i];
						let j = i - 1;
						while(j >= 0 && arr[j] > tmp) {
							arr[j + 1] = arr[j];
							j--;
						}
						arr[j + 1] = tmp;
					}
				}
			};

			function shellInsertSort(arr, d) {
				const len = arr.length;
				for(let i = 1; i < len; i++) {
					if(arr[i] < arr[i - 1]) {
						const tmp = arr[i];
						let j = i -d;
						while(j >= 0 && arr[j] > tmp) {
							arr[j + d] = arr[j];
							j -= d;
						}
						arr[j + d] = tmp;
					}
				}
			}

			function shellSort(arr) {
				console.log('shellSort');
				const len = arr.length;
				let n = parseInt(len / 2);
				while(n > 0) {
					shellInsertSort(arr, n);
					n = parseInt(n / 2);
				}
			}

			function selectSort(arr) {
				console.log('selectSort');
				const len = arr.length;
				for (let i = 0; i < len; i++) {
					let minVal = arr[i];
					let minPos = i;
					for (let j = i + 1; j < len; j++) {
						if(arr[j] < minVal) {
							minPos = j;
							minVal = arr[j];
						}
					}
					arr[minPos] = arr[i];					
					arr[i] = minVal;
				}
			}

			function heapAdjust(arr, a, b) {
				let child = a * 2 + 1;
				while(child <= b) {
					if(child + 1 <= b && arr[child + 1] > arr[child]) {
						child++;
					}
					if(arr[a] < arr[child]) {
						const tmp = arr[a];
						arr[a] = arr[child];
						arr[child] = tmp;
						a = child;
						child = a * 2 + 1;
					} else {
						break;
					}
				}
			}

			function buildHeap(arr) {
				const len = arr.length;
				for( let i = parseInt(len / 2); i >= 0; i--) {
					heapAdjust(arr, i, len - 1) ;
				}
			}

			function heapSort(arr) {
				console.log('heapSort');
				buildHeap(arr);
				for(let j = arr.length - 1; j > 0; j--) {
					const tmp = arr[j];
					arr[j] = arr[0];
					arr[0] = tmp;
					heapAdjust(arr, 0, j - 1);
				}
			}

			function bubbleSort(arr) {
				console.log('bubbleSort');
				const len = arr.length;
				for(let i = 0; i < len; i++) {
					for(let j = 0; j < len - i - 1; j++) {
						if(arr[j] > arr[j + 1]) {
							const tmp = arr[j + 1];
							arr[j + 1] = arr[j];
							arr[j] = tmp;
						}
					}
				}
			}

			function swap(arr, a, b) {
				const tmp = arr[a];
				arr[a] = arr[b];
				arr[b] = tmp;
			}

			function quickPart(arr, low, high) {
				if(low < high) {
					let a = low;
					let b = high;
					const tmp = arr[a];
					while(a < b) {
						while(a < b && arr[b] >= tmp) {
							b--;
						}
						swap(arr, a, b);
						while(a < b && arr[a] <= tmp) {
							a++;
						}
						swap(arr, a, b);					
					}
					quickPart(arr, low, a - 1);
					quickPart(arr, a + 1, high);
				}
				
			}

			function quickSort(arr) {
				console.log('quickSort');
				quickPart(arr, 0, arr.length - 1);
			}

			function merge(arr1, arr2, a, b, c) {
				let i = a;
				let j = b + 1;
				let k = a;
				while (i <= b && j <= c) {
					if(arr1[i] < arr1[j]) {
						arr2[k] = arr1[i];
						i++;
					} else {
						arr2[k] = arr1[j];
						j++;
					}
					k++;
				}
				while(i <= b) {
					arr2[k] = arr1[i];
					i++;
					k++;
				}
				while(j <= c) {
					arr2[k] = arr1[j];
					j++;
					k++;
				}
			}

			function mergeSort(arr) {
				console.log('mergesort');
				const len = arr.length;
				const aux = new Array(len);
				let d = 1;
				while(d < len) {
					for (let i = 0; i < len; i += 2 * d) {
						if(i + 2 * d - 1 <= len) {
							merge(arr, aux, i, i + d - 1, i + 2 * d - 1);
						} else {
							merge(arr, aux, i, i + d - 1, len);
						}
						
					}
					for (let j = 0; j < len; j++) {
						arr[j] = aux[j];
					}
					d = d * 2;
				}

			}

```