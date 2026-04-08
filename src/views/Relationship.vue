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
            <span>点击节点查看详情，使用按钮扩展亲属</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-section">
      <div class="loading-spinner"></div>
      <p>正在查询关系网络...</p>
    </div>

    <div v-if="hasQueried && !isLoading" class="network-section">
      <div class="network-stage">
        <div class="network-stage-head">
          <div class="network-stage-copy">
            <span class="network-stage-kicker">FAMILY TOPOLOGY</span>
            <h2>族谱树</h2>
            <p>以展板式视图呈现当前家族关系，拖拽或缩放即可查看完整谱系脉络。</p>
          </div>
          <div class="toolbar">
            <div class="toolbar-info">
              <span>镜头 {{ Math.round(zoomLevel * 100) }}%</span>
              <span>显示 {{ visibleNodes.length }} 人</span>
            </div>
            <div class="zoom-controls">
              <button @click="zoomIn" class="zoom-btn" title="放大">+</button>
              <button @click="zoomOut" class="zoom-btn" title="缩小">-</button>
              <button @click="resetView" class="zoom-btn reset" title="重置">重置</button>
            </div>
          </div>
        </div>

        <div class="network-shell">
          <div class="network-shell-glow glow-left"></div>
          <div class="network-shell-glow glow-right"></div>
          <div class="network-watermark">族谱树</div>
          <div
            class="network-container"
            ref="containerRef"
            @wheel="handleWheel"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
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
                  <stop offset="0%" style="stop-color:#cbd5e0;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#a0aec0;stop-opacity:1" />
                </linearGradient>
              </defs>

              <!-- 背景网格 -->
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" stroke-width="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />

              <g class="links">
                <polyline
                  v-for="(link, index) in visibleLinks"
                  :key="`link-${index}`"
                  :points="getLinkPoints(link)"
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
                    searchResult: searchResultIds.has(node.id)
                  }"
                  @click="handleNodeClick(node)"
                  @mouseenter="handleNodeHover(node)"
                  @mouseleave="handleNodeLeave"
                >
                  <!-- 节点卡片 - 参考图片样式 -->
                  <rect
                    x="-60"
                    y="-10"
                    width="120"
                    height="140"
                    rx="12"
                    class="node-card"
                  />
                  <!-- 头像圆格 -->
                  <circle
                    cx="0"
                    cy="25"
                    r="28"
                    class="node-avatar-bg"
                  />
                  <text class="node-avatar" text-anchor="middle" x="0" y="34">{{ node.avatar }}</text>

                  <!-- 姓名 - 黑色粗体 -->
                  <text class="node-name" text-anchor="middle" x="0" y="75">{{ node.name }}</text>

                  <!-- 称谓 - 蓝色 -->
                  <text class="node-title" text-anchor="middle" x="0" y="95">{{ getNodeTitle(node) }}</text>

                  <!-- 年份 - 灰色 -->
                  <text class="node-years" text-anchor="middle" x="0" y="115">{{ getNodeYears(node) }}</text>
                </g>
              </g>
            </svg>
          </div>
          <div class="network-edge-mask top"></div>
          <div class="network-edge-mask bottom"></div>
        </div>
      </div>

      <div class="tips-section">
        <div class="tips-card">
          <div class="tips-icon">💡</div>
          <h3>使用提示</h3>
          <ul>
            <li>年龄分类：儿童(0-12)、少年(13-17)、青年(18-40)、中年(41-59)、老人(60+)</li>
            <li>搜索结果会高亮显示，并突出相关联的节点和连接线</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="info-panel" v-if="selectedNode">
      <div class="info-card">
        <div class="info-drag-handle"></div>
        <div class="info-header">
          <h3>人员详情</h3>
          <button class="close-btn" @click="selectedNode = null">×</button>
        </div>
        <!-- 增加滚动容器 -->
        <div class="info-content-scroll">
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
            <button class="expand-btn" @click="expandSelectedNode">
              扩展亲属关系
            </button>
          </div>
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
      svgWidth: 5000,
      svgHeight: 3200,
      selectedNode: null,
      searchName: '',
      isLoading: false,
      hasQueried: false,
      queriedIds: new Set(),
      searchResultIds: new Set(),
      highlightedPathIds: new Set(),
      hoveredNode: null,
      zoomLevel: 1,
      baseNodeWidth: 168,
      baseNodeHeight: 156,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      startTranslateX: 0,
      startTranslateY: 0
    }
  },
  mounted() {
    this.initFamilyTree()
    this.loadTopLevelNodes()
  },
  beforeUnmount() {
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

      // 默认使用手机端缩放级别
      this.zoomLevel = 0.7

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
          this.hasQueried = true

          // 加载完成后自动对焦，稍微延迟确保容器尺寸已稳定
          setTimeout(() => {
            this.$nextTick(() => {
              this.autoFit()
            })
          }, 100)
        }

        this.isLoading = false
      }, 800) // 稍微延长 loading 时间，等待布局稳定
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
        this.highlightedPathIds.clear()
        return
      }

      this.isLoading = true

      setTimeout(() => {
        const searchResults = this.allNodes.filter(n => n.name.includes(this.searchName.trim()))

        if (searchResults.length > 0) {
          this.searchResultIds = new Set(searchResults.map(node => node.id))
          
          // 收集完整的祖先链路
          this.highlightedPathIds = new Set()
          searchResults.forEach(node => {
            this.highlightedPathIds.add(node.id)
            // 添加所有祖先节点
            this.addAllAncestorsToPath(node.id, this.highlightedPathIds)
          })

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
          this.hasQueried = true

          // 查询后确保自动对焦，延迟确保 DOM 渲染完成
          this.$nextTick(() => {
            setTimeout(() => {
              this.autoFit()
            }, 150)
          })
        } else {
          alert('未找到该人员，请检查姓名是否正确')
          this.searchResultIds.clear()
          this.highlightedPathIds.clear()
        }

        this.isLoading = false
      }, 300)
    },
    addAllAncestorsToPath(nodeId, pathSet) {
      const parents = this.getParents(nodeId)
      parents.forEach(parent => {
        if (!pathSet.has(parent.id)) {
          pathSet.add(parent.id)
          this.addAllAncestorsToPath(parent.id, pathSet)
        }
      })
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
      this.hasQueried = true

      // 扩展节点后自动对焦，确保新节点可见
      this.$nextTick(() => {
        this.autoFit()
      })
    },
    layoutNodes(nodes, targetNode = null) {
      const nodeWidth = this.baseNodeWidth
      const nodeHeight = this.baseNodeHeight
      const horizontalGap = 30
      const verticalGap = 62

      const generationMap = new Map()
      nodes.forEach(node => {
        const gen = node.generation
        if (!generationMap.has(gen)) {
          generationMap.set(gen, [])
        }
        generationMap.get(gen).push(node)
      })

      const generations = Array.from(generationMap.keys()).sort((a, b) => a - b)

      let maxNodesPerGeneration = 1
      generationMap.forEach(group => {
        if (group.length > maxNodesPerGeneration) {
          maxNodesPerGeneration = group.length
        }
      })

      const totalTreeWidth = maxNodesPerGeneration * nodeWidth + (maxNodesPerGeneration - 1) * horizontalGap

      const startX = 2500 // 固定画布中心起始点
      let currentY = 200

      generations.forEach(gen => {
        const genNodes = generationMap.get(gen)
        const totalWidth = genNodes.length * nodeWidth + (genNodes.length - 1) * horizontalGap
        const startXOffset = startX - totalWidth / 2 + nodeWidth / 2

        genNodes.forEach((node, index) => {
          node.x = startXOffset + index * (nodeWidth + horizontalGap)
          node.y = currentY
        })

        currentY += nodeHeight + verticalGap
      })
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
      // 移除自动扩展 queryNode，解决点击弹开的问题
    },
    expandSelectedNode() {
      if (this.selectedNode && !this.queriedIds.has(this.selectedNode.id)) {
        this.queryNode(this.selectedNode, false)
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
    getNodeTopAnchor(id) {
      const node = this.getSafeNode(id)
      return { x: node.x, y: node.y - 12 }
    },
    getNodeBottomAnchor(id) {
      const node = this.getSafeNode(id)
      return { x: node.x, y: node.y + 144 }
    },
    getLinkPoints(link) {
      const source = this.getNodeBottomAnchor(link.source)
      const target = this.getNodeTopAnchor(link.target)
      const middleY = source.y + (target.y - source.y) / 2
      return `${source.x},${source.y} ${source.x},${middleY} ${target.x},${middleY} ${target.x},${target.y}`
    },
    getNodeSubtitle(node) {
      return `${node.gender} · ${node.age}岁`
    },
    getNodeTitle(node) {
      // 根据 generation 返回称谓
      const titles = {
        0: '长辈',
        1: '父辈',
        2: '我辈',
        3: '子辈',
        4: '孙辈'
      }
      return titles[node.generation] || '家族成员'
    },
    getNodeYears(node) {
      // 模拟年份数据
      const startYear = 1940 + (4 - node.generation) * 20
      return `${startYear} - ${node.age > 70 ? 2020 : ''}`
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
      // 搜索结果的完整祖先链路高亮
      if (this.highlightedPathIds.has(node.id)) return true
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
      // 搜索结果的完整祖先链路高亮
      if (this.highlightedPathIds.has(link.source) && this.highlightedPathIds.has(link.target)) {
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

      // 重置后自动对焦
      this.$nextTick(() => {
        this.autoFit()
      })
    },
    autoFit() {
      if (this.visibleNodes.length === 0) return

      const container = this.$refs.containerRef
      if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
        setTimeout(() => this.autoFit(), 100)
        return
      }

      // 1. 获取全景观包围盒 (BBox) - 增加坐标过滤
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
      let validNodes = 0

      this.visibleNodes.forEach(node => {
        if (typeof node.x === 'number' && typeof node.y === 'number' && !isNaN(node.x) && !isNaN(node.y)) {
          if (node.x < minX) minX = node.x
          if (node.x > maxX) maxX = node.x
          if (node.y < minY) minY = node.y
          if (node.y > maxY) maxY = node.y
          validNodes++
        }
      })

      if (validNodes === 0) {
        this.translateX = 0
        this.translateY = 0
        this.zoomLevel = 1
        return
      }

      // 考虑卡片自身的真实宽度
      const contentWidth = (maxX - minX) + this.baseNodeWidth
      const contentHeight = (maxY - minY) + this.baseNodeHeight

      const padding = 30 // 默认使用手机端的 padding
      const availWidth = container.clientWidth - padding * 2
      const availHeight = container.clientHeight - padding * 2

      // 2. 计算缩放比例
      let targetZoom = Math.min(availWidth / contentWidth, availHeight / contentHeight)
      targetZoom = Math.max(0.25, Math.min(targetZoom, 1.0))
      this.zoomLevel = targetZoom

      // 3. 居中计算：将逻辑中心点与容器中心点对齐
      const logicCenterX = minX + contentWidth / 2
      const logicCenterY = minY + contentHeight / 2

      // 增加溢出保护，确保居中坐标不是极端大数
      const targetX = container.clientWidth / 2 - (logicCenterX * this.zoomLevel)
      const targetY = container.clientHeight / 2 - (logicCenterY * this.zoomLevel)

      this.translateX = isNaN(targetX) ? 0 : targetX
      this.translateY = isNaN(targetY) ? 0 : targetY
    },
    // 核心缩放算法：支持以特定点为中心进行缩放
    updateZoom(newZoom, anchorX, anchorY) {
      const oldZoom = this.zoomLevel
      const zoomThreshold = 0.15

      // 限制缩放区间
      newZoom = Math.max(0.2, Math.min(newZoom, 2.0))

      if (newZoom === oldZoom) return

      // 核心补偿公式：
      // 新位移 = 锚点 - (锚点 - 旧位移) * (新缩放 / 旧缩放)
      this.translateX = anchorX - (anchorX - this.translateX) * (newZoom / oldZoom)
      this.translateY = anchorY - (anchorY - this.translateY) * (newZoom / oldZoom)
      this.zoomLevel = newZoom
    },
    zoomIn() {
      const container = this.$refs.containerRef
      if (!container) return
      this.updateZoom(this.zoomLevel + 0.15, container.clientWidth / 2, container.clientHeight / 2)
    },
    zoomOut() {
      const container = this.$refs.containerRef
      if (!container) return
      this.updateZoom(this.zoomLevel - 0.15, container.clientWidth / 2, container.clientHeight / 2)
    },
    handleWheel(event) {
      if (!event.ctrlKey && !event.metaKey) return

      event.preventDefault()
      const container = this.$refs.containerRef
      if (!container) return

      const rect = container.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      const delta = event.deltaY > 0 ? -0.1 : 0.1
      this.updateZoom(this.zoomLevel + delta, mouseX, mouseY)
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

        let nextTranslateX = this.startTranslateX + deltaX
        let nextTranslateY = this.startTranslateY + deltaY

        // 电子围栏：限制位移防止消失，并处理 NaN
        if (isFinite(nextTranslateX) && isFinite(nextTranslateY)) {
          this.translateX = Math.max(-5000, Math.min(5000, nextTranslateX))
          this.translateY = Math.max(-5000, Math.min(5000, nextTranslateY))
        }
      }
    },
    handleMouseUp() {
      this.isDragging = false
    },
    handleTouchStart(event) {
      if (event.touches.length === 1) {
        this.isDragging = true
        this.startX = event.touches[0].clientX
        this.startY = event.touches[0].clientY
        this.startTranslateX = this.translateX
        this.startTranslateY = this.translateY
      }
    },
    handleTouchMove(event) {
      if (this.isDragging && event.touches.length === 1) {
        const deltaX = event.touches[0].clientX - this.startX
        const deltaY = event.touches[0].clientY - this.startY

        let nextTranslateX = this.startTranslateX + deltaX
        let nextTranslateY = this.startTranslateY + deltaY

        // 电子围栏：限制位移防止消失，并处理 NaN
        if (isFinite(nextTranslateX) && isFinite(nextTranslateY)) {
          this.translateX = Math.max(-5000, Math.min(5000, nextTranslateX))
          this.translateY = Math.max(-5000, Math.min(5000, nextTranslateY))
        }
      }
    },
    handleTouchEnd() {
      this.isDragging = false
    },
    optimizeLayout() {
      if (this.visibleNodes.length > 0) {
        requestAnimationFrame(() => {
          this.layoutNodes(this.visibleNodes)
        })
      }
    }
  }
}
</script>

<style scoped>
.relationship {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
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

.network-section {
  padding: 0 16px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.network-stage {
  position: relative;
  padding: 24px;
  border-radius: 28px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid rgba(226, 232, 240, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}



.network-stage-head {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.network-stage-copy {
  max-width: 420px;
}

.network-stage-kicker {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.28em;
  color: #64748b;
  margin-bottom: 10px;
}

.network-stage-copy h2 {
  margin: 0;
  font-size: 40px;
  line-height: 1;
  color: #1e293b;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.92);
}

.network-stage-copy p {
  margin: 12px 0 0;
  color: #64748b;
  line-height: 1.7;
  font-size: 14px;
}

.toolbar {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.toolbar:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.toolbar-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  font-size: 13px;
  color: #64748b;
}

.toolbar-info span {
  padding: 7px 14px;
  background: #f8fafc;
  border: 1px solid rgba(226, 232, 240, 1);
  border-radius: 999px;
  font-weight: 600;
}

.toolbar-info span:hover {
  background: #f1f5f9;
}

.zoom-controls {
  display: flex;
  gap: 10px;
}

.zoom-btn {
  min-width: 44px;
  height: 44px;
  padding: 0 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.92);
  color: #3d2e19;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-btn:hover {
  border-color: rgba(138, 111, 68, 0.35);
  background: #fffdf8;
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(148, 163, 184, 0.18);
}

.zoom-btn:active {
  transform: translateY(0);
}

.zoom-btn.reset {
  font-size: 13px;
  letter-spacing: 0.08em;
}

.network-shell {
  position: relative;
  z-index: 1;
  overflow: hidden;
  border: 1px solid #f0f4ff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.network-guide-chip {
  display: inline-flex;
  align-items: center;
  margin: 0 0 14px 8px;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  color: #9a8f7d;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 219, 208, 0.96);
}

.network-shell {
  --network-viewport-height: clamp(420px, 64vh, 720px);
}

.network-container {
  position: relative;
  overflow-x: auto;
  overflow-y: auto;
  flex: 0 0 auto;
  width: 100%;
  height: var(--network-viewport-height);
  border: 1px solid rgba(226, 219, 208, 0.96);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.98);
  cursor: grab;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;

  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.network-container:active {
  cursor: grabbing;
}

.network-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* 移除旧的滚动条样式 */

/* 移除旧的滚动条样式 */

.network-svg {
  position: relative;
  z-index: 1;
  min-width: 100%;
  min-height: 100%;
  display: block;
  padding: 30px 44px 40px;
  background: transparent;
  transition: transform 0.1s ease;
  transform-origin: 0 0; /* 极其重要：确保缩放和位移基准点一致 */
}
.link {
  fill: none;
  stroke: #E2E8F0;
  stroke-width: 1.5;
  transition: all 0.3s ease;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.link.highlighted {
  stroke: #3182CE;
  stroke-width: 2;
}

.node {
  cursor: pointer;
}

/* 移除 scale 效果，防止 hover 时碰撞盒变化导致的震动 */
.node:hover .node-card {
  stroke: #3182CE;
  stroke-width: 2;
  filter: drop-shadow(0 8px 24px rgba(49, 130, 206, 0.15));
}

.node-card {
  fill: #FFFFFF;
  stroke: #E2E8F0;
  stroke-width: 1;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.05));
}

.node.selected .node-card {
  stroke: #3182CE;
  stroke-width: 2;
  filter: drop-shadow(0 4px 16px rgba(49, 130, 206, 0.2));
}

.node-avatar-bg {
  fill: #EDF2F7;
  stroke: #FFFFFF;
  stroke-width: 3;
}

.node-avatar {
  font-size: 28px;
  pointer-events: none;
}

.node-name {
  font-size: 16px;
  fill: #1A202C;
  font-weight: 800;
  pointer-events: none;
}

.node-title {
  font-size: 13px;
  fill: #3182CE;
  font-weight: 600;
  pointer-events: none;
}

.node-years {
  font-size: 11px;
  fill: #A0AEC0;
  pointer-events: none;
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
  z-index: 2050; /* 提升层级，确保在导航栏之上 */
  animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.info-content-scroll {
  max-height: 60vh; /* 限制高度，支持滚动 */
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.info-content-scroll::-webkit-scrollbar {
  display: none;
}

.info-drag-handle {
  width: 40px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin: 0 auto 12px;
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
  .page-header h1 {
    font-size: 20px;
    margin: 5px 0;
  }

  .header-content {
    padding: 0;
  }


  .network-stage {
    padding: 8px;
    border-radius: 0;
    box-shadow: none;
  }

  .network-stage-copy p {
    display: none;
  }

  .network-stage-copy h2 {
    font-size: 18px;
    margin-bottom: 4px;
  }

  .network-stage-head {
    gap: 8px;
    padding-bottom: 5px;
  }

  .toolbar {
    width: 100%;
    padding: 4px 8px;
    border-radius: 8px;
    gap: 5px;
  }

  .toolbar-info {
    font-size: 10px;
    gap: 8px;
  }

  .zoom-controls {
    width: 100%;
  }

  .zoom-btn {
    height: 30px;
    font-size: 12px;
  }

  .network-shell {
    --network-viewport-height: clamp(360px, 58vh, 520px);
  }

  .network-watermark {
    display: none;
  }

  .network-container {
    height: var(--network-viewport-height);
    max-height: none;
  }

  .info-panel {
    bottom: 0;
    left: 0;
    right: 0;
    animation: slideUpBottom 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .info-card {
    border-radius: 20px 20px 0 0;
    padding: 16px 20px;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  }

  .node-detail {
    padding: 10px 0;
  }

  .detail-avatar {
    width: 50px;
    height: 50px;
    font-size: 24px;
    margin-bottom: 8px;
  }

  .relations {
    margin-top: 10px;
  }

  .relations h5 {
    font-size: 14px;
  }

  .relations li {
    font-size: 13px;
    padding: 6px 0;
  }

  .expand-btn {
    padding: 12px;
    margin-top: 12px;
  }
}

@keyframes slideUpBottom {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
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
