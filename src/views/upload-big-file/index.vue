<template>
    <div>
        <el-upload :http-request="handleHttpRequest">
          <el-button type=""></el-button>
        </el-upload>
        <el-button @click="mergeChunks" > merge</el-button>
    </div>
</template>
<script setup lang="ts">
import { UploadRequestOptions } from 'element-plus';
import { reactive, ref } from 'vue';
let data = reactive<any[]>([])
const SIZE = 10 * 1024 * 1024
const filename = ref('')
const createFileChunk = (file:File, size=SIZE) => {
  const fileChunkList = []
  let cur = 0
  while(cur < file.size) {
    fileChunkList.push({chunk: file.slice(cur, cur + size)})
    cur +=size
  }
  return fileChunkList
}
const uploadChunks = async () => {
  const requestList = data.map(item => {
    const formdata = new FormData()
    formdata.append('chunk', item.chunk)
    formdata.append('hash', item.hash)
    formdata.append('filename', filename.value)
    return {formdata}
  }).map(({formdata}) => {
    return fetch('http://localhost:3000', 
    {
      method: 'POST',
      body: formdata
    }
    )
  })
  await Promise.all(requestList)
}

const mergeChunks = () => {
  const data = {
    size: SIZE,
    filename: '10.1.mp4'
  }
  fetch('http://localhost:3000/merge', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
}

const handleHttpRequest = (option: UploadRequestOptions) => {
  const name = filename.value = option.file.name
  const fileChunkList = createFileChunk(option.file)
  data = fileChunkList.map((item, index) => {
    return {
      chunk: item.chunk,
      hash: `${name}_${index}`
    }
  })
  console.log(data)
 uploadChunks()
}
</script>