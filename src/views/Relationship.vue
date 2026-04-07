<template>
  <div class="relationship">
    <div class="page-header">
      <div class="header-decoration">
        <div class="header-shape shape-1"></div>
        <div class="header-shape shape-2"></div>
        <div class="header-shape shape-3"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">👥</div>
        <div class="header-label">家族关系</div>
        <h1>人员关系拓扑</h1>
        <div class="header-divider"></div>
        <p class="header-subtitle">查询和展示家族亲属关系网络</p>
      </div>
    </div>

    <div class="genealogy-section">
      <div class="genealogy-card">
        <div class="genealogy-title">字辈（派语）</div>
        <div class="genealogy-content">
          <div class="genealogy-line">崇德景啟    正大昌扬</div>
          <div class="genealogy-line">家声丕振    世泽悠长</div>
          <div class="genealogy-line">必有馀庆    乃发其祥</div>
          <div class="genealogy-line">经文纬武    永茂南方</div>
        </div>
      </div>
    </div>

    <div class="search-section">
      <div class="search-box-wrapper">
        <input 
          v-model="searchName" 
          type="text" 
          placeholder="请输入要查询的人员姓名..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
        <button @click="handleSearch" class="search-btn" :disabled="isLoading">
          {{ isLoading ? '查询中...' : '查询' }}
        </button>
      </div>
    </div>

    <div v-if="!hasQueried && !isLoading" class="guide-section">
      <div class="guide-card">
        <div class="guide-icon">🔍</div>
        <h3>欢迎使用关系查询</h3>
        <p>请在上方输入框中输入人员姓名</p>
        <p>点击"查询"按钮查看其亲属关系网络</p>
        <div class="guide-tips">
          <div class="tip-item">
            <span class="tip-number">1</span>
            <span>输入姓名进行查询</span>
          </div>
          <div class="tip-item">
            <span class="tip-number">2</span>
            <span>查看上三代和下三代亲属</span>
          </div>
          <div class="tip-item">
            <span class="tip-number">3</span>
            <span>点击节点可继续扩展</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-section">
      <div class="loading-spinner"></div>
      <p>正在查询关系网络...</p>
    </div>

    <div v-if="hasQueried && !isLoading" class="network-section">
      <div class="toolbar">
        <div class="toolbar-info">
          <span>显示 {{ visibleNodes.length }} 人</span>
          <span>关系 {{ visibleLinks.length }} 条</span>
        </div>
        <div class="zoom-controls">
          <button @click="zoomIn" class="zoom-btn" title="放大">+</button>
          <button @click="zoomOut" class="zoom-btn" title="缩小">-</button>
          <button @click="resetView" class="zoom-btn reset" title="重置">⟲</button>
        </div>
      </div>

      <div class="network-container" ref="containerRef" @wheel="handleWheel" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
        <svg 
          ref="svgRef" 
          class="network-svg"
          :width="svgWidth"
          :height="svgHeight"
          :style="{ transform: `translate(${translateX}px, ${translateY}px) scale(${zoomLevel})` }"
        >
          <defs>
            <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#667eea" flood-opacity="0.3"/>
            </filter>
            <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#002fa7;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="queriedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#fb923c;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="maleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="femaleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#fa709a;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#fee140;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#a0aec0;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#667eea;stop-opacity:0.8" />
            </linearGradient>
            <linearGradient id="highlightedLinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#002fa7;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
            </linearGradient>
          </defs>

          <g class="links">
            <line
              v-for="(link, index) in visibleLinks"
              :key="`link-${index}`"
              :x1="getSafeNode(link.source).x"
              :y1="getSafeNode(link.source).y"
              :x2="getSafeNode(link.target).x"
              :y2="getSafeNode(link.target).y"
              class="link"
              :class="{ highlighted: isLinkHighlighted(link) }"
            />
          </g>

          <g class="nodes">
            <g
              v-for="node in visibleNodes"
              :key="node.id"
              :transform="`translate(${node.x}, ${node.y})`"
              class="node"
              :class="{ 
                highlighted: isNodeHighlighted(node),
                selected: selectedNode?.id === node.id,
                queried: queriedIds.has(node.id),
                searchResult: searchResultIds.has(node.id)
              }"
              @click="handleNodeClick(node)"
              @mouseenter="handleNodeHover(node)"
              @mouseleave="handleNodeLeave"
            >
              <!-- 节点圆圈 -->
              <circle 
                r="30" 
                class="node-circle"
                :class="{ 
                  'node-male': node.gender === '男',
                  'node-female': node.gender === '女',
                  'node-selected': selectedNode?.id === node.id,
                  'node-queried': queriedIds.has(node.id),
                  'node-search-result': searchResultIds.has(node.id)
                }"
              />
              
              <!-- 节点内容 -->
              <text class="node-avatar" text-anchor="middle" dy="0.35em">{{ node.avatar }}</text>
              <text class="node-name" text-anchor="middle" dy="3.5em">{{ node.name }}</text>
              <text class="node-age" text-anchor="middle" dy="5em">{{ node.age }}岁 · {{ node.gender === '男' ? '男' : '女' }}</text>
              <text v-if="node.relationToQuery" class="node-relation" text-anchor="middle" dy="6.5em">{{ node.relationToQuery }}</text>
            </g>
          </g>
        </svg>
      </div>

      <div class="legend-section">
        <div class="legend-item">
          <span class="legend-dot male"></span>
          <span>男性</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot female"></span>
          <span>女性</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot queried"></span>
          <span>查询对象</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot selected"></span>
          <span>当前选中</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot search-result"></span>
          <span>搜索结果</span>
        </div>
      </div>

      <div class="tips-section">
        <div class="tips-card">
          <div class="tips-icon">💡</div>
          <h3>使用提示</h3>
          <ul>
            <li>点击节点可扩展该人物的上三代和下三代亲属</li>
            <li>滚动查看更多节点</li>
            <li>年龄分类：儿童(0-12)、少年(13-17)、青年(18-40)、中年(41-59)、老人(60+)</li>
            <li>搜索结果会高亮显示，并突出相关联的节点和连接线</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="info-panel" v-if="selectedNode">
      <div class="info-card">
        <div class="info-header">
          <h3>人物详情</h3>
          <button class="close-btn" @click="selectedNode = null">×</button>
        </div>
        <div class="node-detail">
          <div class="detail-avatar">{{ selectedNode.avatar }}</div>
          <h4>{{ selectedNode.name }}</h4>
          <p class="detail-info">{{ selectedNode.gender }} · {{ selectedNode.age }}岁 · {{ getAgeGroup(selectedNode.age) }}</p>
          <div class="relations">
            <h5>亲属关系：</h5>
            <ul>
              <li v-for="(rel, idx) in getNodeRelations(selectedNode.id)" :key="idx">
                {{ rel }}
              </li>
            </ul>
          </div>
          <button class="expand-btn" @click="handleNodeClick(selectedNode)">
            扩展亲属关系
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mockData } from '../data/mockData'

export default {
  name: 'Relationship',
  data() {
    return {
      allNodes: [],
      allLinks: [],
      visibleNodes: [],
      visibleLinks: [],
      width: 400,
      height: 500,
      svgWidth: 400,
      svgHeight: 1000,
      selectedNode: null,
      searchName: '',
      isLoading: false,
      hasQueried: false,
      queriedIds: new Set(),
      searchResultIds: new Set(),
      hoveredNode: null,
      zoomLevel: 1,
      baseNodeWidth: 100,
      baseNodeHeight: 180,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      startTranslateX: 0,
      startTranslateY: 0,
      // 性能优化相关
      isScrolling: false,
      scrollTimeout: null
    }
  },
  mounted() {
    this.initFamilyTree()
    this.adjustSize()
    this.loadTopLevelNodes()
    
    // 使用节流函数优化resize事件处理
    this.throttledAdjustSize = this.throttle(this.adjustSize, 100)
    window.addEventListener('resize', this.throttledAdjustSize)
    
    // 添加滚动事件监听器
    const container = this.$refs.containerRef
    if (container) {
      container.addEventListener('scroll', this.handleScroll)
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.throttledAdjustSize)
    
    // 移除滚动事件监听器
    const container = this.$refs.containerRef
    if (container) {
      container.removeEventListener('scroll', this.handleScroll)
    }
    
    // 清除定时器
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
  },
  methods: {
    initFamilyTree() {
      this.allNodes = mockData.relationshipNetwork.nodes.map(node => ({
        ...node,
        x: 0,
        y: 0,
        relationToQuery: null
      }))
      this.allLinks = mockData.relationshipNetwork.links
    },
    loadTopLevelNodes() {
      this.isLoading = true
      
      setTimeout(() => {
        const topLevelNodes = this.allNodes.filter(node => node.generation === 0)
        
        if (topLevelNodes.length > 0) {
          // 递归加载所有层级节点
          const allHierarchyNodes = []
          const visited = new Set()
          
          const loadAllNodes = (nodes) => {
            nodes.forEach(node => {
              if (!visited.has(node.id)) {
                visited.add(node.id)
                allHierarchyNodes.push(node)
                node.relationToQuery = node.generation === 0 ? '祖先' : '家族成员'
                this.queriedIds.add(node.id)
                
                // 加载子节点
                const children = this.getChildren(node.id)
                if (children.length > 0) {
                  loadAllNodes(children)
                }
              }
            })
          }
          
          loadAllNodes(topLevelNodes)
          
          this.visibleNodes = allHierarchyNodes
          this.updateVisibleLinks()
          
          this.layoutNodes(this.visibleNodes)
          this.adjustSvgHeight()
          this.hasQueried = true
        }
        
        this.isLoading = false
      }, 500)
    },
    adjustSize() {
      const container = this.$refs.containerRef
      if (container) {
        // 计算所需的最小宽度，确保树形结构完整显示
        const nodeWidth = this.baseNodeWidth * this.zoomLevel
        const maxNodesPerGeneration = this.visibleNodes.length > 0 
          ? Math.max(...Object.values(this.visibleNodes.reduce((acc, node) => {
              if (!acc[node.generation]) acc[node.generation] = 0
              acc[node.generation]++
              return acc
            }, {})).map(count => count))
          : 1
        
        const requiredWidth = maxNodesPerGeneration * nodeWidth + 120 // 120px 边距
        this.svgWidth = Math.max(container.clientWidth, requiredWidth)
        this.width = this.svgWidth
        
        if (this.visibleNodes.length > 0) {
          this.layoutNodes(this.visibleNodes)
          this.adjustSvgHeight()
        }
      }
    },
    getAgeGroup(age) {
      if (age >= 60) return '老人'
      if (age >= 41) return '中年'
      if (age >= 18) return '青年'
      if (age >= 13) return '少年'
      return '儿童'
    },
    handleSearch() {
      if (!this.searchName.trim()) {
        this.searchResultIds.clear()
        return
      }

      this.isLoading = true

      setTimeout(() => {
        const searchResults = this.allNodes.filter(n => n.name.includes(this.searchName.trim()))
        
        if (searchResults.length > 0) {
          this.searchResultIds = new Set(searchResults.map(node => node.id))
          
          // 确保搜索结果和相关节点都可见
          const allRelatedNodeIds = new Set(this.searchResultIds)
          
          searchResults.forEach(node => {
            if (!this.visibleNodes.find(n => n.id === node.id)) {
              this.visibleNodes.push(node)
              this.queriedIds.add(node.id)
            }
            
            // 获取所有相关节点
            const relatedNodes = this.getRelatedNodes(node.id)
            relatedNodes.forEach(relatedNode => {
              if (!this.visibleNodes.find(n => n.id === relatedNode.id)) {
                this.visibleNodes.push(relatedNode)
              }
              allRelatedNodeIds.add(relatedNode.id)
            })
          })
          
          this.updateVisibleLinks()
          this.layoutNodes(this.visibleNodes)
          this.adjustSvgHeight()
          this.hasQueried = true
        } else {
          alert('未找到该人员，请检查姓名是否正确')
          this.searchResultIds.clear()
        }
        
        this.isLoading = false
      }, 300)
    },
    getRelatedNodes(nodeId) {
      const relatedNodes = []
      const visited = new Set()
      const queue = [nodeId]
      
      while (queue.length > 0) {
        const currentId = queue.shift()
        if (visited.has(currentId)) continue
        
        visited.add(currentId)
        
        const parents = this.getParents(currentId)
        const children = this.getChildren(currentId)
        
        parents.forEach(parent => {
          if (!visited.has(parent.id)) {
            relatedNodes.push(parent)
            queue.push(parent.id)
          }
        })
        
        children.forEach(child => {
          if (!visited.has(child.id)) {
            relatedNodes.push(child)
            queue.push(child.id)
          }
        })
      }
      
      return relatedNodes
    },
    updateVisibleLinks() {
      const nodeIds = new Set(this.visibleNodes.map(node => node.id))
      this.visibleLinks = this.allLinks.filter(link => 
        nodeIds.has(link.source) && nodeIds.has(link.target)
      )
    },
    queryNode(targetNode, isInitial = false) {
      const relatedNodeIds = new Set([targetNode.id])
      const newVisibleNodes = [targetNode]
      
      if (isInitial) {
        this.queriedIds = new Set([targetNode.id])
        this.searchResultIds.clear()
      } else {
        this.queriedIds.add(targetNode.id)
      }

      targetNode.relationToQuery = isInitial ? '查询对象' : '扩展节点'

      const parents = this.getParents(targetNode.id)
      const grandparents = []
      const greatGrandparents = []
      
      parents.forEach(parent => {
        if (!relatedNodeIds.has(parent.id)) {
          parent.relationToQuery = '父辈'
          newVisibleNodes.push(parent)
          relatedNodeIds.add(parent.id)
          
          const gps = this.getParents(parent.id)
          gps.forEach(gp => {
            if (!relatedNodeIds.has(gp.id)) {
              gp.relationToQuery = '祖父辈'
              grandparents.push(gp)
              relatedNodeIds.add(gp.id)
              
              const ggps = this.getParents(gp.id)
              ggps.forEach(ggp => {
                if (!relatedNodeIds.has(ggp.id)) {
                  ggp.relationToQuery = '曾祖父辈'
                  greatGrandparents.push(ggp)
                  relatedNodeIds.add(ggp.id)
                }
              })
            }
          })
        }
      })
      
      newVisibleNodes.push(...grandparents, ...greatGrandparents)

      const children = this.getChildren(targetNode.id)
      const grandchildren = []
      const greatGrandchildren = []
      
      children.forEach(child => {
        if (!relatedNodeIds.has(child.id)) {
          child.relationToQuery = '子辈'
          newVisibleNodes.push(child)
          relatedNodeIds.add(child.id)
          
          const gcs = this.getChildren(child.id)
          gcs.forEach(gc => {
            if (!relatedNodeIds.has(gc.id)) {
              gc.relationToQuery = '孙辈'
              grandchildren.push(gc)
              relatedNodeIds.add(gc.id)
              
              const ggcs = this.getChildren(gc.id)
              ggcs.forEach(ggc => {
                if (!relatedNodeIds.has(ggc.id)) {
                  ggc.relationToQuery = '曾孙辈'
                  greatGrandchildren.push(ggc)
                  relatedNodeIds.add(ggc.id)
                }
              })
            }
          })
        }
      })
      
      newVisibleNodes.push(...grandchildren, ...greatGrandchildren)

      if (isInitial) {
        this.visibleNodes = newVisibleNodes
      } else {
        newVisibleNodes.forEach(node => {
          if (!this.visibleNodes.find(n => n.id === node.id)) {
            this.visibleNodes.push(node)
          }
        })
      }
      
      this.updateVisibleLinks()
      this.layoutNodes(this.visibleNodes, targetNode)
      this.adjustSvgHeight()
      this.hasQueried = true
    },
    layoutNodes(nodes, targetNode = null) {
      // 避免在滚动时进行布局计算
      if (this.isScrolling) return
      
      // 使用对象解构和缓存提高性能
      const nodeWidth = 120 * this.zoomLevel
      const nodeHeight = 80 * this.zoomLevel
      const nodeSpacing = 40 * this.zoomLevel
      
      // 构建世代映射，使用Map提高性能
      const generationMap = new Map()
      nodes.forEach(node => {
        const gen = node.generation
        if (!generationMap.has(gen)) {
          generationMap.set(gen, [])
        }
        generationMap.get(gen).push(node)
      })

      // 排序世代，确保从上往下展示
      const generations = Array.from(generationMap.keys()).sort((a, b) => a - b)
      
      // 计算每个世代的宽度，确保树形结构均匀分布
      let maxNodesPerGeneration = 1
      generationMap.forEach(nodes => {
        if (nodes.length > maxNodesPerGeneration) {
          maxNodesPerGeneration = nodes.length
        }
      })
      
      const totalTreeWidth = maxNodesPerGeneration * (nodeWidth + nodeSpacing) - nodeSpacing
      const startX = Math.max(this.svgWidth / 2, totalTreeWidth / 2)
      let currentY = 80 * this.zoomLevel

      // 批量更新节点位置，减少DOM操作
      generations.forEach(gen => {
        const genNodes = generationMap.get(gen)
        const totalWidth = genNodes.length * (nodeWidth + nodeSpacing) - nodeSpacing
        const startXOffset = startX - totalWidth / 2 + (nodeWidth + nodeSpacing) / 2
        
        genNodes.forEach((node, index) => {
          node.x = startXOffset + index * (nodeWidth + nodeSpacing)
          node.y = currentY
        })
        
        currentY += nodeHeight + nodeSpacing
      })
    },
    adjustSvgHeight() {
      if (this.visibleNodes.length === 0) {
        this.svgHeight = 500
        return
      }
      const maxY = Math.max(...this.visibleNodes.map(n => n.y))
      this.svgHeight = maxY + 120 * this.zoomLevel
    },
    getParents(nodeId) {
      const parents = []
      this.allLinks.forEach(link => {
        if (link.target === nodeId) {
          const parent = this.allNodes.find(n => n.id === link.source)
          if (parent) {
            parents.push(parent)
          }
        }
      })
      return parents
    },
    getChildren(nodeId) {
      const children = []
      this.allLinks.forEach(link => {
        if (link.source === nodeId) {
          const child = this.allNodes.find(n => n.id === link.target)
          if (child) {
            children.push(child)
          }
        }
      })
      return children
    },
    handleNodeClick(node) {
      this.selectedNode = node
      if (!this.queriedIds.has(node.id)) {
        this.queryNode(node, false)
      }
    },
    handleNodeHover(node) {
      this.hoveredNode = node
    },
    handleNodeLeave() {
      this.hoveredNode = null
    },
    getNodeById(id) {
      return this.visibleNodes.find(n => n.id === id) || this.allNodes.find(n => n.id === id)
    },
    getSafeNode(id) {
      const node = this.getNodeById(id)
      return node || { x: 0, y: 0 }
    },
    getNodeColor(node) {
      if (this.searchResultIds.has(node.id)) {
        return 'url(#queriedGradient)'
      }
      if (this.selectedNode?.id === node.id) {
        return 'url(#nodeGradient)'
      }
      if (this.queriedIds.has(node.id)) {
        return 'url(#queriedGradient)'
      }
      if (node.gender === '男') {
        return 'url(#maleGradient)'
      }
      return 'url(#femaleGradient)'
    },
    isNodeHighlighted(node) {
      if (this.searchResultIds.has(node.id)) return true
      if (this.hoveredNode) {
        return this.visibleLinks.some(link => 
          (link.source === this.hoveredNode.id && link.target === node.id) ||
          (link.target === this.hoveredNode.id && link.source === node.id)
        )
      }
      if (!this.selectedNode) return false
      if (this.selectedNode?.id === node.id) return true
      
      return this.visibleLinks.some(link => 
        (link.source === this.selectedNode.id && link.target === node.id) ||
        (link.target === this.selectedNode.id && link.source === node.id)
      )
    },
    isLinkHighlighted(link) {
      // 搜索结果相关联的连接线高亮
      if (this.searchResultIds.has(link.source) || this.searchResultIds.has(link.target)) {
        return true
      }
      
      // 悬停节点相关联的连接线高亮
      if (this.hoveredNode) {
        return link.source === this.hoveredNode.id || link.target === this.hoveredNode.id
      }
      
      // 选中节点相关联的连接线高亮
      if (this.selectedNode) {
        return link.source === this.selectedNode.id || link.target === this.selectedNode.id
      }
      
      return false
    },
    getNodeRelations(nodeId) {
      const relations = []
      this.visibleLinks.forEach(link => {
        if (link.source === nodeId) {
          const target = this.getNodeById(link.target)
          if (target) {
            relations.push(`${link.relation}：${target.name}`)
          }
        } else if (link.target === nodeId) {
          const source = this.getNodeById(link.source)
          if (source) {
            relations.push(`${link.relation}：${source.name}`)
          }
        }
      })
      return relations
    },
    resetView() {
      this.visibleNodes = []
      this.visibleLinks = []
      this.hasQueried = false
      this.queriedIds = new Set()
      this.searchResultIds = new Set()
      this.selectedNode = null
      this.searchName = ''
      this.hoveredNode = null
      this.zoomLevel = 1
      this.translateX = 0
      this.translateY = 0
      this.loadTopLevelNodes()
    },
    zoomIn() {
      if (this.zoomLevel < 2) {
        this.zoomLevel += 0.2
        this.layoutNodes(this.visibleNodes)
        this.adjustSvgHeight()
      }
    },
    zoomOut() {
      if (this.zoomLevel > 0.6) {
        this.zoomLevel -= 0.2
        this.layoutNodes(this.visibleNodes)
        this.adjustSvgHeight()
      }
    },
    handleWheel(event) {
      event.preventDefault()
      const delta = event.deltaY > 0 ? -0.1 : 0.1
      if (this.zoomLevel + delta >= 0.6 && this.zoomLevel + delta <= 2) {
        this.zoomLevel += delta
        this.layoutNodes(this.visibleNodes)
        this.adjustSvgHeight()
      }
    },
    handleMouseDown(event) {
      this.isDragging = true
      this.startX = event.clientX
      this.startY = event.clientY
      this.startTranslateX = this.translateX
      this.startTranslateY = this.translateY
    },
    handleMouseMove(event) {
      if (this.isDragging) {
        const deltaX = event.clientX - this.startX
        const deltaY = event.clientY - this.startY
        this.translateX = this.startTranslateX + deltaX
        this.translateY = this.startTranslateY + deltaY
      }
    },
    handleMouseUp() {
      this.isDragging = false
    },
    
    // 节流函数，用于优化滚动和调整大小的事件处理
    throttle(fn, delay) {
      let timer = null
      return function() {
        if (!timer) {
          timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
          }, delay)
        }
      }
    },
    
    // 优化布局计算，避免不必要的重计算
    optimizeLayout() {
      if (this.visibleNodes.length > 0) {
        // 使用requestAnimationFrame优化渲染
        requestAnimationFrame(() => {
          this.layoutNodes(this.visibleNodes)
          this.adjustSvgHeight()
        })
      }
    },
    
    // 处理滚动事件，用于虚拟滚动
    handleScroll(event) {
      if (this.isScrolling) return
      
      this.isScrolling = true
      
      // 清除之前的定时器
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout)
      }
      
      // 设置新的定时器
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false
      }, 100)
    }
  }
}
</script>

<style scoped>
.relationship {
  padding-bottom: 30px;
  min-height: 100vh;
}

.page-header {
  position: relative;
  background: linear-gradient(135deg, #002fa7 0%, #1e40af 50%, #3b82f6 100%);
  padding: 60px 20px 50px;
  color: white;
  text-align: center;
  overflow: hidden;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.header-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: drift 8s ease-in-out infinite;
}

.header-shape.shape-1 {
  width: 100px;
  height: 100px;
  top: -30px;
  right: 20%;
  animation-delay: 0s;
}

.header-shape.shape-2 {
  width: 60px;
  height: 60px;
  top: 40px;
  left: 10%;
  animation-delay: 2s;
}

.header-shape.shape-3 {
  width: 40px;
  height: 40px;
  bottom: 30px;
  right: 15%;
  animation-delay: 4s;
}

@keyframes drift {
  0%, 100% {
    -webkit-transform: translate(0, 0) scale(1);
    -moz-transform: translate(0, 0) scale(1);
    -ms-transform: translate(0, 0) scale(1);
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }
  25% {
    -webkit-transform: translate(10px, -10px) scale(1.1);
    -moz-transform: translate(10px, -10px) scale(1.1);
    -ms-transform: translate(10px, -10px) scale(1.1);
    transform: translate(10px, -10px) scale(1.1);
    opacity: 0.7;
  }
  50% {
    -webkit-transform: translate(0, -20px) scale(1);
    -moz-transform: translate(0, -20px) scale(1);
    -ms-transform: translate(0, -20px) scale(1);
    transform: translate(0, -20px) scale(1);
    opacity: 0.6;
  }
  75% {
    -webkit-transform: translate(-10px, -10px) scale(0.9);
    -moz-transform: translate(-10px, -10px) scale(0.9);
    -ms-transform: translate(-10px, -10px) scale(0.9);
    transform: translate(-10px, -10px) scale(0.9);
    opacity: 0.8;
  }
}

.header-content {
  position: relative;
  z-index: 10;
}

.header-icon {
  font-size: 48px;
  margin-bottom: 12px;
  display: inline-block;
  -webkit-animation: bounce 2s ease-in-out infinite;
  -moz-animation: bounce 2s ease-in-out infinite;
  -ms-animation: bounce 2s ease-in-out infinite;
  animation: bounce 2s ease-in-out infinite;
}

@-webkit-keyframes bounce {
  0%, 100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  50% {
    -webkit-transform: translateY(-8px);
    transform: translateY(-8px);
  }
}

@-moz-keyframes bounce {
  0%, 100% {
    -moz-transform: translateY(0);
    transform: translateY(0);
  }
  50% {
    -moz-transform: translateY(-8px);
    transform: translateY(-8px);
  }
}

@keyframes bounce {
  0%, 100% {
    -webkit-transform: translateY(0);
    -moz-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }
  50% {
    -webkit-transform: translateY(-8px);
    -moz-transform: translateY(-8px);
    -ms-transform: translateY(-8px);
    transform: translateY(-8px);
  }
}

.header-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-weight: 500;
}

.page-header h1 {
  font-size: 36px;
  margin: 0 0 12px;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  letter-spacing: 1px;
}

.header-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #60a5fa, #93c5fd);
  border-radius: 2px;
  margin: 0 auto 12px;
}

.header-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
}

.genealogy-section {
  padding: 20px 16px;
}

.genealogy-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  text-align: center;
  transition: all 0.3s ease;
}

.genealogy-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.genealogy-title {
  font-size: 18px;
  font-weight: 700;
  color: #002fa7;
  margin-bottom: 20px;
  letter-spacing: 4px;
}

.genealogy-content {
  font-family: 'KaiTi', '楷体', serif;
  font-size: 18px;
  color: #1a1a1a;
  line-height: 2.2;
}

.genealogy-line {
  letter-spacing: 8px;
}

.search-section {
  padding: 0 16px 20px;
}

.search-box-wrapper {
  display: flex;
  gap: 12px;
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.search-box-wrapper:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.search-input {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
  outline: none;
}

.search-input:focus {
  border-color: #002fa7;
  box-shadow: 0 0 0 4px rgba(0, 47, 167, 0.1);
}

.search-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #002fa7 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 47, 167, 0.3);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.guide-section {
  padding: 0 16px;
}

.guide-card {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%);
  border-radius: 20px;
  padding: 40px 24px;
  text-align: center;
  border: 2px dashed #002fa7;
  transition: all 0.3s ease;
}

.guide-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 47, 167, 0.1);
}

.guide-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.guide-card h3 {
  font-size: 22px;
  color: #1a1a1a;
  margin: 0 0 12px;
  font-weight: 700;
}

.guide-card > p {
  font-size: 15px;
  color: #666;
  margin: 8px 0;
}

.guide-tips {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.tip-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.tip-number {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #002fa7 0%, #3b82f6 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.tip-item span:last-child {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.loading-section {
  padding: 60px 16px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #002fa7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
}

@-moz-keyframes spin {
  to { -moz-transform: rotate(360deg); transform: rotate(360deg); }
}

@keyframes spin {
  to { -webkit-transform: rotate(360deg); -moz-transform: rotate(360deg); -ms-transform: rotate(360deg); transform: rotate(360deg); }
}

.loading-section p {
  font-size: 15px;
  color: #666;
  margin: 0;
}

.network-section {
  padding: 0 16px 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.toolbar:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.toolbar-info {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #666;
}

.toolbar-info span {
  padding: 4px 12px;
  background: #f7fafc;
  border-radius: 100px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.toolbar-info span:hover {
  background: #e2e8f0;
}

.zoom-controls {
  display: flex;
  gap: 8px;
}

.zoom-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-btn:hover {
  border-color: #002fa7;
  background: #f7fafc;
  transform: scale(1.05);
}

.zoom-btn:active {
  transform: scale(0.95);
}

.zoom-btn.reset {
  font-size: 16px;
}

.network-container {
  position: relative;
  overflow: auto;
  max-height: 700px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  background: white;
  cursor: grab;
}

.network-container:active {
  cursor: grabbing;
}

/* 自定义滚动条样式 */
.network-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.network-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
  margin: 10px;
}

.network-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.network-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.network-container::-moz-scrollbar {
  width: 8px;
  height: 8px;
}

.network-container::-moz-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
  margin: 10px;
}

.network-container::-moz-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.network-container::-moz-scrollbar-thumb:hover {
  background: #94a3b8;
}

.network-svg {
  min-width: 100%;
  background: white;
  display: block;
  border-radius: 20px;
  padding: 20px;
  transition: transform 0.1s ease;
}

.link {
  stroke: url(#linkGradient);
  stroke-width: 2;
  transition: all 0.3s ease;
  opacity: 0.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.link:hover {
  stroke-width: 3;
  opacity: 0.9;
  stroke: url(#highlightedLinkGradient);
}

.link.highlighted {
  stroke: url(#highlightedLinkGradient);
  stroke-width: 4;
  opacity: 1;
  stroke-dasharray: 8;
  stroke-dashoffset: 0;
  animation: pulse 2s ease-in-out infinite, dash 3s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -16;
  }
}

@-webkit-keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@-moz-keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.node {
  cursor: pointer;
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
}

.node:hover {
  -webkit-transform: scale(1.05);
  -moz-transform: scale(1.05);
  -ms-transform: scale(1.05);
  transform: scale(1.05);
}

.node-circle {
  stroke: white;
  stroke-width: 2;
  transition: all 0.2s ease;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.node-male {
  fill: url(#maleGradient);
}

.node-female {
  fill: url(#femaleGradient);
}

.node-selected {
  stroke: #002fa7;
  stroke-width: 4;
  filter: url(#nodeShadow);
}

.node-queried {
  stroke: #f093fb;
  stroke-width: 4;
}

.node-search-result {
  stroke: #f97316;
  stroke-width: 5;
  animation: pulse 2s ease-in-out infinite;
}

.node-avatar {
  font-size: 24px;
  pointer-events: none;
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  transition: all 0.3s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  fill: white;
}

.node:hover .node-avatar {
  font-size: 28px;
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  transform: scale(1.1);
}

.node-name {
  font-size: 12px;
  fill: #2d3748;
  font-weight: 600;
  pointer-events: none;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.node:hover .node-name {
  font-size: 13px;
  font-weight: 700;
  fill: #002fa7;
}

.node-age {
  font-size: 10px;
  fill: #002fa7;
  font-weight: 500;
  pointer-events: none;
  transition: all 0.3s ease;
}

.node:hover .node-age {
  fill: #3b82f6;
  font-weight: 600;
}

.node-relation {
  font-size: 9px;
  fill: #718096;
  font-weight: 500;
  pointer-events: none;
  font-style: italic;
  transition: all 0.3s ease;
}

.node:hover .node-relation {
  fill: #4a5568;
}

.legend-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  margin-top: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.legend-section:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  transition: all 0.3s ease;
}

.legend-item:hover {
  color: #002fa7;
  transform: translateY(-2px);
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.legend-item:hover .legend-dot {
  transform: scale(1.2);
}

.legend-dot.queried {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.legend-dot.male {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.legend-dot.female {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.legend-dot.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.legend-dot.search-result {
  background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
}

.tips-section {
  padding: 0;
  margin-top: 16px;
}

.tips-card {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%);
  border-radius: 16px;
  padding: 20px;
  border-left: 4px solid #002fa7;
  transition: all 0.3s ease;
}

.tips-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 47, 167, 0.1);
}

.tips-icon {
  font-size: 28px;
  margin-bottom: 10px;
}

.tips-card h3 {
  font-size: 16px;
  color: #2d3748;
  margin: 0 0 12px;
  font-weight: 600;
}

.tips-card ul {
  margin: 0;
  padding-left: 20px;
}

.tips-card li {
  font-size: 14px;
  color: #4a5568;
  margin-bottom: 6px;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.tips-card li:hover {
  color: #002fa7;
  transform: translateX(4px);
}

.info-panel {
  position: fixed;
  bottom: 80px;
  left: 15px;
  right: 15px;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

@-webkit-keyframes slideUp {
  from {
    -webkit-transform: translateY(100%);
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    -webkit-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}

@-moz-keyframes slideUp {
  from {
    -moz-transform: translateY(100%);
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    -moz-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    -webkit-transform: translateY(100%);
    -moz-transform: translateY(100%);
    -ms-transform: translateY(100%);
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    -webkit-transform: translateY(0);
    -moz-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.info-header h3 {
  font-size: 18px;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f7fafc;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  color: #718096;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e2e8f0;
  transform: scale(1.1);
}

.node-detail {
  text-align: center;
}

.detail-avatar {
  font-size: 56px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.node-detail:hover .detail-avatar {
  transform: scale(1.1);
}

.node-detail h4 {
  font-size: 20px;
  color: #2d3748;
  margin: 0 0 6px;
  font-weight: 700;
}

.detail-info {
  font-size: 14px;
  color: #002fa7;
  margin: 0 0 18px;
  font-weight: 600;
}

.relations h5 {
  font-size: 14px;
  color: #4a5568;
  text-align: left;
  margin: 0 0 12px;
  font-weight: 600;
}

.relations ul {
  list-style: none;
  padding: 0;
  text-align: left;
  max-height: 120px;
  overflow-y: auto;
}

.relations li {
  font-size: 14px;
  color: #718096;
  padding: 10px 0;
  border-bottom: 1px solid #f7fafc;
  transition: all 0.3s ease;
}

.relations li:hover {
  color: #002fa7;
  padding-left: 8px;
}

.relations li:last-child {
  border-bottom: none;
}

.expand-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #002fa7 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.3s;
}

.expand-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 47, 167, 0.3);
}

.expand-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .network-container {
    max-height: 400px;
  }
  
  .genealogy-content {
    font-size: 16px;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
  
  .header-icon {
    font-size: 36px;
  }
}

@media (min-width: 769px) {
  .network-container {
    max-height: 700px;
  }
  
  .svgWidth {
    max-width: 1000px;
  }
}
</style>