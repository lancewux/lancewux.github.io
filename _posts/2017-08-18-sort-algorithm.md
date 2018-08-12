<h1 align="center">排序算法</h1>

排序算法总结：

<p align="center"><img src="/images/posts/2017-08-18/sort.png" /></p>

直接插入排序(Straight Insertion Sort)
-

```javascript
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

const arr = [19, 1, 5, 7, 4, 3, 9, 15, 51, 7];
insertSort(arr);
console.log(arr);
```

希尔排序（Shell`s Sort）
-

```javascript
function shellInsertSort(arr, d) {
	const len = arr.length;
	for(let i = d; i < len; i++) {
		if(arr[i] < arr[i - d]) {
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

const arr = [19, 1, 5, 7, 4, 3, 9, 15, 51, 7];
shellSort(arr);
console.log(arr);
```

简单选择排序（Simple Selection Sort）
-

```javascript
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

const arr = [19, 1, 5, 7, 4, 3, 9, 15, 51, 7];
selectSort(arr);
console.log(arr);
```

堆排序（Heap Sort）
-

```javascript
function heapAdjust(arr, a, b) { //大顶堆
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

const arr = [19, 1, 5, 7, 4, 3, 9, 15, 51, 7];
heapSort(arr);
console.log(arr);
```

冒泡排序（Bubble Sort）
-

```javascript
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

const arr = [19, 1, 5, 7, 4, 3, 9, 15, 51, 7];
bubbleSort(arr);
console.log(arr);
```

快速排序（Quick Sort）
-

```javascript

function quickPart(arr, low, high) {
	if(low >= high) {
		return;
	}
	let a = low;
	let b = high;
	const tmp = arr[a];
	while(a < b) {
		while(a < b && arr[b] >= tmp) {
			b--;
		}
		arr[a] = arr[b]; arr[b] = tmp;
		while(a < b && arr[a] <= tmp) {
			a++;
		}
		arr[b] = arr[a]; arr[a] = tmp;					
	}
	quickPart(arr, low, a - 1);
	quickPart(arr, a + 1, high);
}

function quickSort(arr) {
	console.log('quickSort');
	quickPart(arr, 0, arr.length - 1);
}

const arr = [19, 1, 5, 7, 4, 3, 9, 15, 51, 7];
quickSort(arr);
console.log(arr);
```

归并排序（Merge Sort）
-

```javascript
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

function mergeSort(arr) { //代码有问题
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

const arr = [19, 1, 5, 7, 4, 3, 9, 15, 51, 7];
mergeSort(arr);
console.log(arr);
```

参考资料
-

<a href="http://blog.csdn.net/hguisu/article/details/7776068/" target="_blank">八大排序算法</a>



