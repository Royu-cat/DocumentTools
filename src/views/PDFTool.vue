<template>
  <div>
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 文件上传区域 -->
      <div class="upload-section">
        <van-uploader
            v-model="pdfFile"
            :after-read="handlePdfUpload"
            :max-count="1"
            accept=".pdf"
        >
          <template #default>
            <div class="upload-card">
              <van-icon name="description" size="32" />
              <div class="upload-text">上传PDF文件</div>
            </div>
          </template>
        </van-uploader>

        <van-uploader
            v-model="stampFile"
            :after-read="handleStampUpload"
            :max-count="1"
            accept=".png,.jpg,.jpeg"
        >
          <template #default>
            <div class="upload-card">
              <van-icon name="photo" size="32" />
              <div class="upload-text">上传印章图片</div>
            </div>
          </template>
        </van-uploader>
      </div>

      <!-- 预览区域 -->
      <div class="preview-section" v-if="pdfFile.length > 0">
        <h3 class="section-title">预览区域</h3>
        <div class="preview-container">
          <canvas
              ref="previewCanvas"
              class="preview-canvas"
              @click="handleCanvasClick"
          ></canvas>

          <!-- 印章预览 -->
          <div
              v-if="stampFile.length > 0 && stampPosition"
              class="stamp-preview"
              :style="{
              left: stampPosition.x + 'px',
              top: stampPosition.y + 'px',
              width: stampSize + 'px',
              height: stampSize + 'px',
              opacity: stampOpacity
            }"
          >
            <img :src="stampPreviewUrl" alt="印章预览" />
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel" v-if="stampFile.length > 0">
        <h3 class="section-title">印章设置</h3>

        <!-- 位置控制 -->
        <div class="control-group">
          <div class="control-label">位置调整</div>
          <div class="position-controls">
            <van-button
                size="small"
                @click="adjustPosition('up')"
            >上移</van-button>
            <van-button
                size="small"
                @click="adjustPosition('down')"
            >下移</van-button>
            <van-button
                size="small"
                @click="adjustPosition('left')"
            >左移</van-button>
            <van-button
                size="small"
                @click="adjustPosition('right')"
            >右移</van-button>
          </div>
        </div>

        <!-- 大小滑块 -->
        <div class="control-group">
          <div class="control-label">印章大小</div>
          <van-slider
              v-model="stampSize"
              :min="20"
              :max="200"
              @change="updatePreview"
          >
            <template #button>
              <div class="slider-button">{{ stampSize }}px</div>
            </template>
          </van-slider>
        </div>

        <!-- 透明度滑块 -->
        <div class="control-group">
          <div class="control-label">透明度</div>
          <van-slider
              v-model="stampOpacity"
              :min="0.1"
              :max="1"
              :step="0.1"
              @change="updatePreview"
          >
            <template #button>
              <div class="slider-button">{{ (stampOpacity * 100).toFixed(0) }}%</div>
            </template>
          </van-slider>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <van-button
              type="primary"
              block
              @click="addStampToPdf"
              :loading="isProcessing"
          >
            {{ isProcessing ? '处理中...' : '生成盖章PDF' }}
          </van-button>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="tips-section" v-if="pdfFile.length === 0">
        <van-empty description="请先上传PDF文件和印章图片">
          <template #description>
            <ul class="feature-list">
              <li>PDF文件上传</li>
            </ul>
          </template>
        </van-empty>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { PDFDocument, rgb } from '@pdfme/pdf-lib'
import { saveAs } from 'file-saver'
import { showToast, showDialog } from 'vant'
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

// 响应式数据
const pdfFile = ref([])
const stampFile = ref([])
const previewCanvas = ref(null)
const isProcessing = ref(false)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// 印章配置
const stampConfig = reactive({
  position: { x: 100, y: 100 },
  size: 80,
  opacity: 0.8
})

// 预览相关数据
const stampPreviewUrl = ref('')
const canvasContext = ref(null)

// 监听配置变化
watch(() => stampConfig, () => {
  updatePreview()
}, { deep: true })

// 处理PDF上传
const handlePdfUpload = (file) => {
  if (file.file.type !== 'application/pdf') {
    showToast('请上传PDF文件')
    pdfFile.value = []
    return
  }
  showToast('PDF上传成功')
  renderPdfPreview(file.file)
}

// 处理印章上传
const handleStampUpload = (file) => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
  if (!validTypes.includes(file.file.type)) {
    showToast('请上传PNG或JPG图片')
    stampFile.value = []
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    stampPreviewUrl.value = e.target.result
    updatePreview()
  }
  reader.readAsDataURL(file.file)
}

// 渲染PDF预览
const renderPdfPreview = async (pdfFile) => {

  const arrayBuffer = await pdfFile.arrayBuffer()

  // 设置canvas尺寸
  // previewCanvas.value.width = width
  // previewCanvas.value.height = height

  // canvasContext.value = previewCanvas.value.getContext('2d')

  // 这里简化处理，实际应该使用pdf.js来渲染
  // canvasContext.value.fillStyle = 'white'
  // canvasContext.value.fillRect(0, 0, width, height)
  // canvasContext.value.strokeStyle = 'black'
  // canvasContext.value.strokeRect(10, 10, width - 20, height - 20)
  // canvasContext.value.fillStyle = 'black'
  // canvasContext.value.font = '16px Arial'
  // canvasContext.value.fillText('PDF预览区域', width / 2 - 50, height / 2)


  try {
    let pdfDocument = await pdfjsLib.getDocument(arrayBuffer).promise;
    const page = await pdfDocument.getPage(1);
    const viewport = page.getViewport({
      scale: 1,
      rotation: 0
    });

    const canvas = previewCanvas.value;
    const context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    await page.render(renderContext).promise;
  } catch (error) {
    console.error('渲染页面失败:', error);
  }


}

// 更新预览
const updatePreview = () => {
  if (!canvasContext.value || !stampPreviewUrl.value) return

  // 清除画布
  canvasContext.value.clearRect(0, 0, previewCanvas.value.width, previewCanvas.value.height)

  // 重新绘制PDF预览
  canvasContext.value.fillStyle = 'white'
  canvasContext.value.fillRect(0, 0, previewCanvas.value.width, previewCanvas.value.height)
  canvasContext.value.strokeStyle = 'black'
  canvasContext.value.strokeRect(10, 10, previewCanvas.value.width - 20, previewCanvas.value.height - 20)

  // 绘制印章预览
  const img = new Image()
  img.onload = () => {
    canvasContext.value.save()
    canvasContext.value.globalAlpha = stampConfig.opacity
    canvasContext.value.drawImage(
        img,
        stampConfig.position.x,
        stampConfig.position.y,
        stampConfig.size,
        stampConfig.size
    )
    canvasContext.value.restore()
  }
  img.src = stampPreviewUrl.value
}

// 调整位置
const adjustPosition = (direction) => {
  const step = 10
  switch (direction) {
    case 'up':
      stampConfig.position.y -= step
      break
    case 'down':
      stampConfig.position.y += step
      break
    case 'left':
      stampConfig.position.x -= step
      break
    case 'right':
      stampConfig.position.x += step
      break
  }
  updatePreview()
}

// 画布点击事件
const handleCanvasClick = (event) => {
  if (!previewCanvas.value) return

  const rect = previewCanvas.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  stampConfig.position = { x, y }
  updatePreview()
}

// 添加印章到PDF
const addStampToPdf = async () => {
  if (pdfFile.value.length === 0 || stampFile.value.length === 0) {
    showToast('请先上传PDF文件和印章图片')
    return
  }

  isProcessing.value = true

  try {
    const pdfArrayBuffer = await pdfFile.value[0].file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer)

    const stampArrayBuffer = await stampFile.value[0].file.arrayBuffer()
    const stampImage = await pdfDoc.embedPng(stampArrayBuffer)

    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    // 计算相对位置（基于PDF页面尺寸）
    const relativeX = stampConfig.position.x / previewCanvas.value.width * width
    const relativeY = height - (stampConfig.position.y / previewCanvas.value.height * height) - (stampConfig.size / previewCanvas.value.height * height)

    firstPage.drawImage(stampImage, {
      x: relativeX,
      y: relativeY,
      width: stampConfig.size / previewCanvas.value.width * width,
      height: stampConfig.size / previewCanvas.value.height * height,
      opacity: stampConfig.opacity
    })

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })

    saveAs(blob, `盖章文件_${new Date().getTime()}.pdf`)
    showToast('文件生成成功')
  } catch (error) {
    console.error('处理PDF时出错:', error)
    showToast('处理失败，请重试')
  } finally {
    isProcessing.value = false
  }
}

// 显示帮助
const showHelp = () => {
  showDialog({
    title: '使用说明',
    message: '1. 上传PDF文件和印章图片\n2. 在预览区域点击选择盖章位置\n3. 调整大小和透明度\n4. 点击生成并下载文件',
    confirmButtonText: '知道了'
  })
}

// 计算属性
const stampPosition = computed(() => stampConfig.position)
const stampSize = computed({
  get: () => stampConfig.size,
  set: (value) => { stampConfig.size = value }
})

const stampOpacity = computed({
  get: () => stampConfig.opacity,
  set: (value) => { stampConfig.opacity = value }
})

onMounted(() => {
  // 初始化代码
})
</script>

<style scoped>
.pdf-stamp-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-content {
  padding: 16px;
  padding-bottom: 80px;
}

.upload-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.upload-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px dashed #e0e0e0;
  transition: all 0.3s ease;
}

.upload-card:hover {
  border-color: #1989fa;
  transform: translateY(-2px);
}

.upload-text {
  margin-top: 8px;
  font-size: 14px;
  color: #646566;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
}

.preview-section {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.preview-container {
  position: relative;
  background: #f8f9fa;
  border-radius: 8px;
}

.preview-canvas {
  background: white;
  cursor: crosshair;
}

.stamp-preview {
  position: absolute;
  pointer-events: none;
  border: 2px dashed #1989fa;
}

.stamp-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.control-panel {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.control-group {
  margin-bottom: 20px;
}

.control-label {
  font-size: 14px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 8px;
}

.position-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.slider-button {
  background: #1989fa;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.action-buttons {
  margin-top: 24px;
}

.tips-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-list {
  text-align: left;
  margin-top: 12px;
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 6px;
  color: #646566;
}

.van-nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.van-nav-bar :deep(.van-nav-bar__title) {
  color: white;
  font-weight: 600;
}

.van-nav-bar :deep(.van-icon) {
  color: white;
}
</style>