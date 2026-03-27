<template>
  <div class="image-tool">
    <!-- 顶部浮动工具栏 -->
    <div class="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200 overflow-x-auto">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-3 min-w-max">
          <!-- 左侧工具选择 -->
          <div class="flex items-center space-x-4">
            <!-- 工具选择 -->
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 whitespace-nowrap">工具:</span>
              <button
                  @click="switchTool('text')"
                  :class="currentTool === 'text' ? 'bg-primary text-white' : 'bg-gray-200 text-dark hover:bg-gray-300'"
                  class="font-medium py-1 px-3 rounded-md text-sm transition-all-300 btn-hover whitespace-nowrap"
              >
                <i class="fa fa-font mr-1"></i> 文字
              </button>
              <button
                  @click="switchTool('erase')"
                  :class="currentTool === 'erase' ? 'bg-primary text-white' : 'bg-gray-200 text-dark hover:bg-gray-300'"
                  class="font-medium py-1 px-3 rounded-md text-sm transition-all-300 btn-hover whitespace-nowrap"
              >
                <i class="fa fa-paint-brush mr-1"></i> 涂抹
              </button>
            </div>
          </div>

          <!-- 右侧操作按钮 -->
          <div class="flex items-center space-x-3">
            <button
                @click="downloadImage"
                class="bg-accent hover:bg-blue-500 text-white font-medium py-1 px-3 rounded-md text-sm transition-all-300 btn-hover"
                :class="{ hidden: !hasImage }"
            >
              <i class="fa fa-download mr-1"></i> 下载
            </button>

            <!-- 缩放控制 -->
            <div class="flex items-center space-x-1" :class="{ hidden: !hasImage }" id="zoomControls">
              <button @click="zoomOut" class="bg-gray-200 hover:bg-gray-300 text-dark font-medium py-1 px-2 rounded-md text-sm transition-all-300 btn-hover">
                <i class="fa fa-search-minus"></i>
              </button>
              <span class="flex items-center justify-center bg-gray-100 rounded-md text-dark font-medium text-sm px-2">
                {{ Math.round(imageScale * 100) }}%
              </span>
              <button @click="zoomIn" class="bg-gray-200 hover:bg-gray-300 text-dark font-medium py-1 px-2 rounded-md text-sm transition-all-300 btn-hover">
                <i class="fa fa-search-plus"></i>
              </button>
            </div>

            <button
                @click="resetEditor"
                class="bg-gray-200 hover:bg-gray-300 text-dark font-medium py-1 px-3 rounded-md text-sm transition-all-300 btn-hover"
                :class="{ hidden: !hasImage }"
            >
              <i class="fa fa-refresh mr-1"></i> 重置
            </button>
          </div>
        </div>

        <!-- 工具面板 (根据选择的工具显示不同内容) -->
        <div class="py-2 border-t border-gray-200 bg-gray-50">
          <!-- 文字工具面板 -->
          <div v-show="currentTool === 'text'" class="px-4 py-2">
            <!-- 所有控件放在一个flex-wrap容器中 -->
            <div class="flex flex-wrap items-end gap-4 gap-y-3">
              <!-- 上传按钮 -->
              <div>
                <button @click="triggerFileInput" class="flex items-center bg-gray-200 hover:bg-gray-300 text-dark font-medium py-1 px-2 rounded-md text-xs transition-all-300 btn-hover">
                  <i class="fa fa-upload mr-1"></i> 上传图片
                  <input
                      type="file"
                      ref="imageUpload"
                      accept="image/*"
                      class="hidden"
                      @change="handleImageUpload"
                  >
                </button>
              </div>

              <!-- 提示信息 -->
              <div class="text-xs text-gray-600 italic">
                <i class="fa fa-info-circle mr-1"></i> 点击图片空白处添加文字
              </div>

              <!-- 文字内容 -->
              <div class="w-full min-w-[200px]">
                <label for="textContent" class="block text-xs text-gray-600 mb-1">文字内容:</label>
                <input
                    type="text"
                    v-model="textContent"
                    placeholder="请输入文字内容..."
                    class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                >
              </div>

              <!-- 字体选择 -->
              <div class="min-w-[100px]">
                <label for="fontFamily" class="block text-xs text-gray-600 mb-1">字体:</label>
                <select
                    v-model="fontFamily"
                    class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Microsoft YaHei', sans-serif">微软雅黑</option>
                  <option value="'SimHei', sans-serif">黑体</option>
                  <option value="'SimSun', serif">宋体</option>
                  <option value="'KaiTi', serif">楷体</option>
                </select>
              </div>

              <!-- 字号 -->
              <div class="min-w-[150px]">
                <label for="fontSize" class="block text-xs text-gray-600 mb-1">字号:</label>
                <div class="flex items-center">
                  <input
                      type="range"
                      v-model.number="fontSize"
                      min="12"
                      max="200"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  >
                  <span class="ml-2 text-sm font-medium text-dark min-w-[30px] text-center">{{ fontSize }}</span>
                </div>
              </div>

              <!-- 旋转角度 -->
              <div class="min-w-[150px]">
                <label for="textRotation" class="block text-xs text-gray-600 mb-1">旋转:</label>
                <div class="flex items-center">
                  <input
                      type="range"
                      v-model.number="textRotation"
                      min="-180"
                      max="180"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  >
                  <span class="ml-2 text-sm font-medium text-dark min-w-[40px] text-center">{{ textRotation }}°</span>
                </div>
              </div>

              <!-- 文字颜色 -->
              <div class="min-w-[120px]">
                <label for="fontColor" class="block text-xs text-gray-600 mb-1">颜色:</label>
                <div class="flex items-center">
                  <input
                      type="color"
                      v-model="fontColor"
                      class="w-6 h-6 rounded border-0 cursor-pointer"
                  >
                  <input
                      type="text"
                      v-model="fontColor"
                      class="ml-2 flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-sm"
                  >
                </div>
              </div>

              <!-- 文字样式 -->
              <div class="min-w-[120px]">
                <label class="block text-xs text-gray-600 mb-1">样式:</label>
                <div class="flex space-x-1">
                  <button
                      @click="toggleBold"
                      :class="isBold ? 'bg-gray-300' : 'bg-white'"
                      class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-all-300 text-sm min-w-[32px]"
                  >
                    <i class="fa fa-bold"></i>
                  </button>
                  <button
                      @click="toggleItalic"
                      :class="isItalic ? 'bg-gray-300' : 'bg-white'"
                      class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-all-300 text-sm min-w-[32px]"
                  >
                    <i class="fa fa-italic"></i>
                  </button>
                  <button
                      @click="toggleUnderline"
                      :class="isUnderline ? 'bg-gray-300' : 'bg-white'"
                      class="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition-all-300 text-sm min-w-[32px]"
                  >
                    <i class="fa fa-underline"></i>
                  </button>
                </div>
              </div>

              <!-- 删除按钮 - 仅在选中文字时显示 -->
              <div class="min-w-[100px]" v-if="selectedTextObject !== null">
                <label class="block text-xs text-gray-600 mb-1">操作:</label>
                <button
                    @click="deleteSelectedText"
                    class="px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-md hover:bg-red-200 transition-all-300 text-sm"
                >
                  <i class="fa fa-trash mr-1"></i> 删除
                </button>
              </div>
            </div>
          </div>

          <!-- 涂抹工具面板 -->
          <div v-show="currentTool === 'erase'" class="px-4 py-2">
            <!-- 所有控件放在一个flex-wrap容器中 -->
            <div class="flex flex-wrap items-end gap-3 gap-y-3">
              <!-- 功能按钮 -->
              <div class="flex gap-2">
                <button
                    @click="toggleColorPicker"
                    :class="isColorPickerActive ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'"
                    class="flex items-center text-dark font-medium py-1 px-2 rounded-md text-xs transition-all-300 btn-hover"
                >
                  <i class="fa fa-eyedropper mr-1"></i> 取色器
                </button>
                <button
                    @click="clearAllErases"
                    class="flex items-center bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1 px-2 rounded-md text-xs transition-all-300 btn-hover"
                >
                  <i class="fa fa-trash mr-1"></i> 清除
                </button>
              </div>

              <!-- 涂抹颜色 -->
              <div class="min-w-[120px]">
                <label for="eraseColor" class="block text-xs text-gray-600 mb-1">颜色:</label>
                <div class="flex items-center">
                  <input
                      type="color"
                      v-model="eraseColor"
                      class="w-5 h-5 rounded border-0 cursor-pointer"
                  >
                  <input
                      type="text"
                      v-model="eraseColor"
                      class="ml-1 flex-1 px-1 py-0.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-xs"
                  >
                </div>
              </div>

              <!-- 画笔大小 -->
              <div class="min-w-[120px]">
                <label for="brushSize" class="block text-xs text-gray-600 mb-1">画笔大小:</label>
                <div class="flex items-center">
                  <input
                      type="range"
                      v-model.number="brushSize"
                      min="5"
                      max="50"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  >
                  <span class="ml-2 text-xs font-medium text-dark min-w-[24px] text-center">{{ brushSize }}</span>
                </div>
              </div>

              <!-- 透明度 -->
              <div class="min-w-[120px]">
                <label for="eraseOpacity" class="block text-xs text-gray-600 mb-1">透明度:</label>
                <div class="flex items-center">
                  <input
                      type="range"
                      v-model.number="eraseOpacity"
                      min="0"
                      max="100"
                      class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  >
                  <span class="ml-2 text-xs font-medium text-dark min-w-[30px] text-center">{{ eraseOpacity }}%</span>
                </div>
              </div>

              <!-- 提示信息 -->
              <div class="text-xs text-gray-600 italic">
                <i class="fa fa-info-circle mr-1"></i> 拖动鼠标涂抹覆盖文字
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 pt-96 pb-8">
      <div class="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center relative">
        <!-- 上传提示 -->
        <div v-show="!hasImage" class="text-center z-10">
          <i class="fa fa-image text-5xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-medium text-gray-500 mb-2">请上传一张图片开始编辑</h3>
          <p class="text-sm text-gray-400">支持拖拽上传或点击顶部工具栏的上传按钮</p>
        </div>

        <!-- Canvas 容器 - 始终存在但初始时隐藏 -->
        <div
            class="canvas-container relative overflow-auto"
            :style="{
            maxHeight: 'calc(100vh - 160px)',
            maxWidth: '100%',
            display: hasImage ? 'block' : 'none'
          }"
            @dragover.prevent
            @drop="handleDrop"
        >
          <div
              ref="canvasWrapper"
              class="relative"
              :style="{
              transform: `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${imageScale})`,
              transformOrigin: '0 0'
            }"
          >
            <canvas
                ref="imageCanvas"
                @mousedown="handleCanvasMouseDown"
                @mousemove="handleCanvasMouseMove"
                @mouseup="handleCanvasMouseUp"
                @mouseleave="handleCanvasMouseUp"
                @touchstart="handleCanvasTouchStart"
                @touchmove="handleCanvasTouchMove"
                @touchend="handleCanvasTouchEnd"
                style="max-width: 100%; height: auto;"
            ></canvas>
            <div class="absolute top-0 left-0" ref="textLayer"></div>
            <!-- 浮起文字输入框 - PS风格透明输入框 -->
            <div
                v-if="textInputVisible"
                class="absolute z-50 flex items-center"
                :style="{
                left: textInputPosition.x + 'px',
                top: textInputPosition.y + 'px',
                transform: 'translate(-50%, -50%)'
              }"
            >
              <input
                  id="textInputField"
                  v-model="tempTextContent"
                  @keyup.enter="confirmTextInput"
                  @keyup.esc="cancelTextInput"
                  class="px-2 py-1 bg-transparent border-2 border-dashed border-blue-500 rounded-none focus:outline-none focus:ring-0 focus:border-blue-700 text-black placeholder-gray-400"
                  placeholder="输入文字..."
                  maxlength="100"
                  style="min-width: 120px; background-color: rgba(255, 255, 255, 0.1);"
              >
              <button
                  @click="confirmTextInput"
                  class="ml-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow-md"
                  title="确认"
              >
                <i class="fa fa-check"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 模板引用
import {computed, nextTick, onMounted, ref, watch} from "vue";
// 模板引用
const imageUpload = ref(null);
const imageCanvas = ref(null);
const textLayer = ref(null);
const canvasWrapper = ref(null);

// 响应式数据
const canvas = ref(null);
const ctx = ref(null);
const image = ref(new Image());
const textObjects = ref([]);
const selectedTextObject = ref(null);
const isDragging = ref(false);
const isTwoFingerDrag = ref(false);
const dragOffsetX = ref(0);
const dragOffsetY = ref(0);
const currentRotation = ref(0);
const lastCenterX = ref(null);
const lastCenterY = ref(null);



// 涂抹工具相关变量
const currentTool = ref('text'); // 'text' 或 'erase'
const eraseObjects = ref([]);
const isErasing = ref(false);
const lastEraseX = ref(0);
const lastEraseY = ref(0);
const brushSize = ref(20);
const eraseColor = ref('#ffffff');
const eraseOpacity = ref(100);
const isColorPickerActive = ref(false);

// 图片拖动相关变量
const isDraggingImage = ref(false);
const imageOffsetX = ref(0);
const imageOffsetY = ref(0);
const lastMouseX = ref(0);
const lastMouseY = ref(0);
const imageScale = ref(1);
const originalImageWidth = ref(0);
const originalImageHeight = ref(0);

// 文字工具相关变量
const textContent = ref('');
const fontFamily = ref('Arial, sans-serif');
const fontSize = ref(24);
const fontColor = ref('#000000');
const isBold = ref(false);
const isItalic = ref(false);
const isUnderline = ref(false);
const textRotation = ref(0);

// 浮起输入框相关变量
const showTextInput = ref(false);
const tempTextContent = ref('');
const textInputPosition = ref({ x: 0, y: 0 });
const textInputVisible = ref(false);

// 计算属性
const hasImage = computed(() => originalImageWidth.value > 0 && originalImageHeight.value > 0);

// 方法
const init = () => {
  try {
    // 设置拖拽上传
    setupDragAndDrop();

    // 延迟尝试获取 Canvas（因为初始时 Canvas 可能被隐藏）
    setTimeout(() => {
      if (imageCanvas.value && !canvas.value) {
        canvas.value = imageCanvas.value;
        ctx.value = canvas.value.getContext('2d');
      }
    }, 100);
  } catch (error) {
    console.error('Initialization error:', error);
  }
};

const triggerFileInput = () => {
  imageUpload.value.click();
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      image.value.src = event.target.result;
      image.value.onload = function() {
        setupCanvas();
        displayImage();
      };
    };
    reader.readAsDataURL(file);
  }
};

const setupDragAndDrop = () => {
  const dropArea = document.body;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    document.body.classList.add('bg-blue-50');
  }

  function unhighlight() {
    document.body.classList.remove('bg-blue-50');
  }

  dropArea.addEventListener('drop', handleDrop, false);
};

const handleDrop = (e) => {
  const dt = e.dataTransfer;
  const file = dt.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(event) {
      image.value.src = event.target.result;
      image.value.onload = function() {
        setupCanvas();
        displayImage();
      };
    };
    reader.readAsDataURL(file);
  }
};

const setupCanvas = () => {
  // 保存原始图片尺寸
  originalImageWidth.value = image.value.width;
  originalImageHeight.value = image.value.height;

  // 确保 Canvas 元素可用
  if (!canvas.value && imageCanvas.value) {
    canvas.value = imageCanvas.value;
    ctx.value = canvas.value.getContext('2d');
  }

  if (!canvas.value) return;

  // 设置canvas为图片原始大小
  canvas.value.width = originalImageWidth.value;
  canvas.value.height = originalImageHeight.value;

  // 重置偏移量
  imageOffsetX.value = 0;
  imageOffsetY.value = 0;

  // 获取容器尺寸
  if (canvasWrapper.value && canvasWrapper.value.parentElement) {
    const containerWidth = canvasWrapper.value.parentElement.clientWidth;
    const containerHeight = canvasWrapper.value.parentElement.clientHeight;

    // 如果图片小于容器，居中显示
    if (originalImageWidth.value < containerWidth) {
      imageOffsetX.value = (containerWidth - originalImageWidth.value) / 2;
    }

    if (originalImageHeight.value < containerHeight) {
      imageOffsetY.value = (containerHeight - originalImageHeight.value) / 2;
    }

    // 设置canvasWrapper的大小
    canvasWrapper.value.style.width = `${originalImageWidth.value}px`;
    canvasWrapper.value.style.height = `${originalImageHeight.value}px`;
  }

  // 重置文字和涂抹对象的位置
  resetObjectsPosition();
};

const resetObjectsPosition = () => {
  // 这里可以根据需要调整文字和涂抹对象的位置
  // 目前保持不变，因为它们是相对于canvas定位的
};

const displayImage = () => {
  if (!ctx.value || !canvas.value) return;

  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.value.drawImage(image.value, 0, 0, originalImageWidth.value, originalImageHeight.value);
  drawTextObjects();
};

const drawTextObjects = () => {
  if (!textLayer.value) return;

  // 清除文字层
  while (textLayer.value.firstChild) {
    textLayer.value.removeChild(textLayer.value.firstChild);
  }

  // 绘制所有文字对象
  textObjects.value.forEach((obj, index) => {
    if (!obj) return;

    const textDiv = document.createElement('div');
    textDiv.className = 'absolute';
    textDiv.style.left = `${obj.x || 0}px`;
    textDiv.style.top = `${obj.y || 0}px`;
    textDiv.style.fontFamily = obj.fontFamily || 'Arial, sans-serif';
    textDiv.style.fontSize = `${obj.fontSize || 24}px`;
    textDiv.style.color = obj.color || '#000000';
    textDiv.style.fontWeight = obj.isBold ? 'bold' : 'normal';
    textDiv.style.fontStyle = obj.isItalic ? 'italic' : 'normal';
    textDiv.style.textDecoration = obj.isUnderline ? 'underline' : 'none';
    textDiv.style.transform = `rotate(${obj.rotation || 0}deg)`;
    textDiv.style.transformOrigin = 'center center';
    textDiv.style.display = 'inline-block';
    textDiv.style.textAlign = 'center';
    textDiv.style.minWidth = '100px';
    textDiv.style.wordBreak = 'normal';
    textDiv.style.overflow = 'visible';
    textDiv.style.cursor = 'move';
    textDiv.style.userSelect = 'none';
    textDiv.style.whiteSpace = 'nowrap';
    textDiv.style.width = 'auto';
    textDiv.style.maxWidth = 'none';
    textDiv.style.lineHeight = '1.2';
    textDiv.style.direction = 'ltr';
    textDiv.style.unicodeBidi = 'normal';
    textDiv.style.wordWrap = 'normal';
    textDiv.style.overflowWrap = 'normal';
    textDiv.style.flexShrink = '0';
    textDiv.textContent = obj.text || '';

    // 专门的鼠标事件处理
    const handleMouseDown = (e) => {
      e.stopPropagation();
      selectTextObject(index, e);

      const handleMouseMove = (moveEvent) => {
        const obj = textObjects.value[index];
        if (obj && canvas.value) {
          const canvasRect = canvas.value.getBoundingClientRect();
          const scaleX = canvas.value.width / canvasRect.width;
          const scaleY = canvas.value.height / canvasRect.height;

          obj.x = (moveEvent.clientX - canvasRect.left - dragOffsetX.value) * scaleX / imageScale.value - imageOffsetX.value / imageScale.value;
          obj.y = (moveEvent.clientY - canvasRect.top - dragOffsetY.value) * scaleY / imageScale.value - imageOffsetY.value / imageScale.value;

          drawTextObjects();
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    // 专门的触摸事件处理
    const handleTouchStart = (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const touchEvent = { clientX: touch.clientX, clientY: touch.clientY };
        selectTextObject(index, touchEvent);

        let lastTouchX = touch.clientX;
        let lastTouchY = touch.clientY;
        let animationId = null;

        const handleTouchMove = (moveEvent) => {
          moveEvent.stopPropagation();
          moveEvent.preventDefault();

          if (moveEvent.touches.length === 1) {
            const currentTouch = moveEvent.touches[0];
            const deltaX = currentTouch.clientX - lastTouchX;
            const deltaY = currentTouch.clientY - lastTouchY;

            // 只有在移动超过一定阈值时才更新，避免误触
            if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
              const obj = textObjects.value[index];
              if (obj && canvas.value) {
                const canvasRect = canvas.value.getBoundingClientRect();
                const scaleX = canvas.value.width / canvasRect.width;
                const scaleY = canvas.value.height / canvasRect.height;

                // 直接使用delta更新位置，避免重新计算完整坐标
                obj.x += (deltaX * scaleX) / imageScale.value;
                obj.y += (deltaY * scaleY) / imageScale.value;

                if (animationId) {
                  cancelAnimationFrame(animationId);
                }

                animationId = requestAnimationFrame(() => {
                  drawTextObjects();
                });
              }

              lastTouchX = currentTouch.clientX;
              lastTouchY = currentTouch.clientY;
            }
          }
        };

        const handleTouchEnd = (endEvent) => {
          endEvent.stopPropagation();

          if (animationId) {
            cancelAnimationFrame(animationId);
          }

          // 强制最后一次重绘
          if (textObjects.value[index] && canvas.value) {
            drawTextObjects();
          }

          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
          document.removeEventListener('touchcancel', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchEnd);
      }
    };

    // 添加事件监听器
    textDiv.addEventListener('mousedown', handleMouseDown);
    textDiv.addEventListener('touchstart', handleTouchStart, { passive: false });

    textLayer.value.appendChild(textDiv);
  });
};

const selectTextObject = (index, e) => {
  if (index < 0 || index >= textObjects.value.length) return;

  selectedTextObject.value = index;

  // 更新工具栏的值
  const obj = textObjects.value[index];
  if (obj) {
    textContent.value = obj.text || '';
    fontFamily.value = obj.fontFamily || 'Arial, sans-serif';
    fontSize.value = obj.fontSize || 24;
    fontColor.value = obj.color || '#000000';
    isBold.value = !!obj.isBold;
    isItalic.value = !!obj.isItalic;
    isUnderline.value = !!obj.isUnderline;
    textRotation.value = obj.rotation || 0;
  }

  // 计算拖拽偏移量
  if (textLayer.value && textLayer.value.children[index]) {
    const rect = textLayer.value.children[index].getBoundingClientRect();
    dragOffsetX.value = e.clientX - rect.left;
    dragOffsetY.value = e.clientY - rect.top;

    isDragging.value = true;

    // 添加全局鼠标事件
    document.addEventListener('mousemove', dragTextObject);
    document.addEventListener('mouseup', () => {
      isDragging.value = false;
      document.removeEventListener('mousemove', dragTextObject);
    });
  }
};

const dragTextObject = (e) => {
  if (!isDragging.value || selectedTextObject.value === null) return;

  const obj = textObjects.value[selectedTextObject.value];
  if (!obj || !canvas.value) return;

  const canvasRect = canvas.value.getBoundingClientRect();

  // 计算新位置（考虑缩放和偏移）
  const scaleX = canvas.value.width / canvasRect.width;
  const scaleY = canvas.value.height / canvasRect.height;

  obj.x = (e.clientX - canvasRect.left - dragOffsetX.value) * scaleX / imageScale.value - imageOffsetX.value / imageScale.value;
  obj.y = (e.clientY - canvasRect.top - dragOffsetY.value) * scaleY / imageScale.value - imageOffsetY.value / imageScale.value;

  drawTextObjects();
};

const addText = (x, y) => {
  if (!tempTextContent.value.trim()) return;

  const textObject = {
    text: tempTextContent.value,
    x: x,
    y: y,
    fontFamily: fontFamily.value,
    fontSize: fontSize.value,
    color: fontColor.value,
    isBold: isBold.value,
    isItalic: isItalic.value,
    isUnderline: isUnderline.value,
    rotation: textRotation.value
  };

  textObjects.value.push(textObject);
  drawTextObjects();

  // 清空临时内容并隐藏输入框
  tempTextContent.value = '';
  textInputVisible.value = false;
};

const showTextInputDialog = (x, y) => {
  // 直接使用鼠标点击的位置
  textInputPosition.value = { x: x, y: y };
  textInputVisible.value = true;
  tempTextContent.value = '';

  // 延迟聚焦输入框
  setTimeout(() => {
    const inputElement = document.getElementById('textInputField');
    if (inputElement) {
      inputElement.focus();
    }
  }, 100);
};

const cancelTextInput = () => {
  tempTextContent.value = '';
  textInputVisible.value = false;
};

const confirmTextInput = () => {
  if (tempTextContent.value.trim() !== '') {
    // 直接使用点击位置作为文字位置（简化计算）
    const x = textInputPosition.value.x;
    const y = textInputPosition.value.y;

    // 添加新的文字对象
    textObjects.value.push({
      id: Date.now(),
      text: tempTextContent.value,
      x: x,
      y: y,
      fontFamily: fontFamily.value,
      fontSize: fontSize.value,
      color: fontColor.value,
      isBold: isBold.value,
      isItalic: isItalic.value,
      isUnderline: isUnderline.value,
      rotation: textRotation.value
    });

    // 重新绘制文字
    drawTextObjects();
  }

  // 清空输入框并隐藏
  tempTextContent.value = '';
  textInputVisible.value = false;
};

const toggleBold = () => {
  isBold.value = !isBold.value;
  if (selectedTextObject.value !== null) {
    textObjects.value[selectedTextObject.value].isBold = isBold.value;
    drawTextObjects();
  }
};

const toggleItalic = () => {
  isItalic.value = !isItalic.value;
  if (selectedTextObject.value !== null) {
    textObjects.value[selectedTextObject.value].isItalic = isItalic.value;
    drawTextObjects();
  }
};

const toggleUnderline = () => {
  isUnderline.value = !isUnderline.value;
  if (selectedTextObject.value !== null) {
    textObjects.value[selectedTextObject.value].isUnderline = isUnderline.value;
    drawTextObjects();
  }
};

const deleteSelectedText = () => {
  if (selectedTextObject.value !== null) {
    textObjects.value.splice(selectedTextObject.value, 1);
    selectedTextObject.value = null;
    drawTextObjects();
  }
};

const switchTool = (tool) => {
  currentTool.value = tool;
  selectedTextObject.value = null;
};

const handleCanvasMouseDown = (e) => {
  const rect = canvas.value.getBoundingClientRect();
  const scaleX = canvas.value.width / rect.width;
  const scaleY = canvas.value.height / rect.height;

  const x = (e.clientX - rect.left) * scaleX / imageScale.value - imageOffsetX.value / imageScale.value;
  const y = (e.clientY - rect.top) * scaleY / imageScale.value - imageOffsetY.value / imageScale.value;

  if (currentTool.value === 'text') {
    // 检查是否点击了文字对象
    let clickedText = false;
    for (let i = textObjects.value.length - 1; i >= 0; i--) {
      const obj = textObjects.value[i];
      const textDiv = textLayer.value.children[i];
      const textRect = textDiv.getBoundingClientRect();

      if (
          e.clientX >= textRect.left &&
          e.clientX <= textRect.right &&
          e.clientY >= textRect.top &&
          e.clientY <= textRect.bottom
      ) {
        selectTextObject(i, e);
        clickedText = true;
        break;
      }
    }

    // 如果没有点击文字对象，显示文字输入框
    if (!clickedText) {
      showTextInputDialog(x, y);
    }
  } else if (currentTool.value === 'erase') {
    if (isColorPickerActive.value) {
      // 取色器功能
      const pixelData = ctx.value.getImageData(x, y, 1, 1).data;
      const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
      eraseColor.value = hexColor;
      isColorPickerActive.value = false;
    } else {
      // 开始涂抹
      isErasing.value = true;
      lastEraseX.value = x;
      lastEraseY.value = y;

      // 开始新的涂抹路径
      eraseObjects.value.push({
        path: [{x, y}],
        color: eraseColor.value,
        size: brushSize.value,
        opacity: eraseOpacity.value / 100
      });
    }
  }

  // 检查是否按住Ctrl键（用于拖动图片）
  if (e.ctrlKey || e.metaKey) {
    isDraggingImage.value = true;
    lastMouseX.value = e.clientX;
    lastMouseY.value = e.clientY;
  }
};

const handleCanvasMouseMove = (e) => {
  if (!canvas.value) {
    return;
  }

  const rect = canvas.value.getBoundingClientRect();
  const scaleX = canvas.value.width / rect.width;
  const scaleY = canvas.value.height / rect.height;

  const x = (e.clientX - rect.left) * scaleX / imageScale.value - imageOffsetX.value / imageScale.value;
  const y = (e.clientY - rect.top) * scaleY / imageScale.value - imageOffsetY.value / imageScale.value;

  if (currentTool.value === 'erase' && isErasing.value && !isColorPickerActive.value) {
    // 继续涂抹路径
    const currentPath = eraseObjects.value[eraseObjects.value.length - 1];
    currentPath.path.push({x, y});

    // 绘制涂抹效果
    drawErasePath(lastEraseX.value, lastEraseY.value, x, y, currentPath);

    lastEraseX.value = x;
    lastEraseY.value = y;
  }

  // 拖动图片
  if (isDraggingImage.value) {
    const deltaX = e.clientX - lastMouseX.value;
    const deltaY = e.clientY - lastMouseY.value;

    imageOffsetX.value += deltaX;
    imageOffsetY.value += deltaY;

    lastMouseX.value = e.clientX;
    lastMouseY.value = e.clientY;
  }
};

const handleCanvasMouseUp = () => {
  isErasing.value = false;
  isDraggingImage.value = false;
};

const handleCanvasTouchStart = (e) => {
  // 不阻止默认行为，让文字层可以接收触摸事件
  if (e.touches.length === 2) {
    e.preventDefault();
    isTwoFingerDrag.value = true;
    return;
  }

  // 单指操作时不阻止默认行为，让文字可以被点击和拖动
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY,
    ctrlKey: false,
    metaKey: false
  });

  canvas.value.dispatchEvent(mouseEvent);
};

const handleCanvasTouchMove = (e) => {
  e.preventDefault();

  // 双指拖动画布
  if (e.touches.length === 2 && isTwoFingerDrag.value) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];

    // 计算两指中心点
    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;

    // 如果是第一次计算，记录初始位置
    if (!lastCenterX.value && !lastCenterY.value) {
      lastCenterX.value = centerX;
      lastCenterY.value = centerY;
      return;
    }

    // 计算移动距离
    const deltaX = centerX - lastCenterX.value;
    const deltaY = centerY - lastCenterY.value;

    // 移动画布
    imageOffsetX.value += deltaX;
    imageOffsetY.value += deltaY;

    // 更新上一次的中心点
    lastCenterX.value = centerX;
    lastCenterY.value = centerY;

    return;
  }

  // 单指操作，转换为鼠标事件
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });

  canvas.value.dispatchEvent(mouseEvent);
};

const handleCanvasTouchEnd = (e) => {
  e.preventDefault();
  const mouseEvent = new MouseEvent('mouseup', {});
  canvas.value.dispatchEvent(mouseEvent);
  isTwoFingerDrag.value = false;
  lastCenterX.value = null;
  lastCenterY.value = null;
};

const drawErasePath = (x1, y1, x2, y2, pathObj) => {
  ctx.value.save();

  // 如果是透明模式，使用destination-out合成模式
  if (pathObj.opacity < 1) {
    ctx.value.globalCompositeOperation = 'destination-out';
    ctx.value.globalAlpha = 1 - pathObj.opacity;
  } else {
    ctx.value.globalCompositeOperation = 'source-over';
    ctx.value.globalAlpha = 1;
    ctx.value.fillStyle = pathObj.color;
  }

  ctx.value.lineWidth = pathObj.size;
  ctx.value.lineCap = 'round';
  ctx.value.lineJoin = 'round';

  ctx.value.beginPath();
  ctx.value.moveTo(x1, y1);
  ctx.value.lineTo(x2, y2);
  ctx.value.stroke();

  ctx.value.restore();
};

const toggleColorPicker = () => {
  isColorPickerActive.value = !isColorPickerActive.value;
};

const clearAllErases = () => {
  eraseObjects.value = [];
  displayImage(); // 重绘图片和文字
};

const zoomIn = () => {
  if (imageScale.value < 3) {
    imageScale.value += 0.1;
  }
};

const zoomOut = () => {
  if (imageScale.value > 0.5) {
    imageScale.value -= 0.1;
  }
};

const resetEditor = () => {
  // 重置缩放和偏移
  imageScale.value = 1;
  imageOffsetX.value = 0;
  imageOffsetY.value = 0;

  // 重置文字和涂抹对象
  textObjects.value = [];
  eraseObjects.value = [];

  // 重绘
  displayImage();
};

const downloadImage = () => {
  // 创建一个临时canvas来合并所有内容
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = originalImageWidth.value;
  tempCanvas.height = originalImageHeight.value;
  const tempCtx = tempCanvas.getContext('2d');

  // 绘制原始图片
  tempCtx.drawImage(image.value, 0, 0);

  // 绘制所有涂抹效果
  eraseObjects.value.forEach(pathObj => {
    tempCtx.save();

    if (pathObj.opacity < 1) {
      tempCtx.globalCompositeOperation = 'destination-out';
      tempCtx.globalAlpha = 1 - pathObj.opacity;
    } else {
      tempCtx.globalCompositeOperation = 'source-over';
      tempCtx.globalAlpha = 1;
      tempCtx.strokeStyle = pathObj.color;
    }

    tempCtx.lineWidth = pathObj.size;
    tempCtx.lineCap = 'round';
    tempCtx.lineJoin = 'round';

    tempCtx.beginPath();
    tempCtx.moveTo(pathObj.path[0].x, pathObj.path[0].y);

    for (let i = 1; i < pathObj.path.length; i++) {
      tempCtx.lineTo(pathObj.path[i].x, pathObj.path[i].y);
    }

    tempCtx.stroke();
    tempCtx.restore();
  });

  // 绘制所有文字
  textObjects.value.forEach(obj => {
    tempCtx.save();
    tempCtx.font = `${obj.isBold ? 'bold' : ''} ${obj.isItalic ? 'italic' : ''} ${obj.fontSize}px ${obj.fontFamily}`;
    tempCtx.fillStyle = obj.color;
    tempCtx.textDecoration = obj.isUnderline ? 'underline' : 'none';

    // 应用旋转
    tempCtx.translate(obj.x, obj.y);
    tempCtx.rotate(obj.rotation * Math.PI / 180);

    tempCtx.fillText(obj.text, 0, 0);
    tempCtx.restore();
  });

  // 创建下载链接
  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = tempCanvas.toDataURL();
  link.click();
};

const rgbToHex = (r, g, b) => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// 监听字体相关属性变化

watch(fontFamily, (newVal) => {
  if (selectedTextObject.value !== null) {
    textObjects.value[selectedTextObject.value].fontFamily = newVal;
    drawTextObjects();
  }
});

watch(fontSize, (newVal) => {
  if (selectedTextObject.value !== null) {
    textObjects.value[selectedTextObject.value].fontSize = newVal;
    drawTextObjects();
  }
});

watch(fontColor, (newVal) => {
  if (selectedTextObject.value !== null) {
    textObjects.value[selectedTextObject.value].color = newVal;
    drawTextObjects();
  }
});

watch(textRotation, (newVal) => {
  if (selectedTextObject.value !== null) {
    textObjects.value[selectedTextObject.value].rotation = newVal;
    drawTextObjects();
  }
});

// 生命周期钩子
onMounted(() => {
  nextTick(() => {
    init();
  });
});

</script>

<style scoped>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 工具类 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.transition-all-300 { transition: all 0.3s ease; }

.canvas-container {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.text-shadow {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* 表单元素样式 */

/* 按钮样式 */

.image-tool{position: absolute;left: 0;right: 0;top: 46px;bottom: 0;display: flex;flex-direction: column;}
.image-tool > .fixed{position: unset;min-height: 180px;}
.image-tool > .container{flex: 1;width: 100%;padding-top: 1rem;}
.image-tool > .fixed > .container > div{padding: 8px}
</style>