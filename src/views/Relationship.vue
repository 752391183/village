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
          <button @click="resetView" class="zoom-btn reset" title="重置">⟲</button>
        </div>
      </div>

      <div class="network-container" ref="containerRef">
        <svg 
          ref="svgRef" 
          class="network-svg"
          :width="svgWidth"
          :height="svgHeight"
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
                queried: queriedIds.has(node.id)
              }"
              @click="handleNodeClick(node)"
            >
              <circle 
                :r="getNodeRadius(node)" 
                class="node-circle"
                :fill="getNodeColor(node)"
              />
              <text class="node-avatar" text-anchor="middle" dy="0.35em">{{ node.avatar }}</text>
              <text class="node-name" text-anchor="middle" dy="3.5em">{{ node.name }}</text>
              <text class="node-age" text-anchor="middle" dy="5em">{{ getAgeGroup(node.age) }} · {{ node.gender === '男' ? '♂' : '♀' }}</text>
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
      </div>

      <div class="tips-section">
        <div class="tips-card">
          <div class="tips-icon">💡</div>
          <h3>使用提示</h3>
          <ul>
            <li>点击节点可扩展该人物的上三代和下三代亲属</li>
            <li>滚动查看更多节点</li>
            <li>年龄分类：儿童(0-12)、少年(13-17)、青年(18-40)、中年(41-59)、老人(60+)</li>
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
      queriedIds: new Set()
    }
  },
  mounted() {
    this.initFamilyTree()
    this.adjustSize()
    window.addEventListener('resize', this.adjustSize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.adjustSize)
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
    adjustSize() {
      const container = this.$refs.containerRef
      if (container) {
        this.svgWidth = Math.min(container.clientWidth, 600)
        this.width = this.svgWidth
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
        return
      }

      this.isLoading = true
      this.hasQueried = false

      setTimeout(() => {
        const targetNode = this.allNodes.find(n => n.name.includes(this.searchName.trim()))
        
        if (targetNode) {
          this.queryNode(targetNode, true)
        } else {
          alert('未找到该人员，请检查姓名是否正确')
        }
        
        this.isLoading = false
      }, 500)
    },
    queryNode(targetNode, isInitial = false) {
      const relatedNodeIds = new Set([targetNode.id])
      const newVisibleNodes = [targetNode]
      const newVisibleLinks = []
      
      if (isInitial) {
        this.queriedIds = new Set([targetNode.id])
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
          newVisibleLinks.push(this.getLink(parent.id, targetNode.id))
          
          const gps = this.getParents(parent.id)
          gps.forEach(gp => {
            if (!relatedNodeIds.has(gp.id)) {
              gp.relationToQuery = '祖父辈'
              grandparents.push(gp)
              relatedNodeIds.add(gp.id)
              newVisibleLinks.push(this.getLink(gp.id, parent.id))
              
              const ggps = this.getParents(gp.id)
              ggps.forEach(ggp => {
                if (!relatedNodeIds.has(ggp.id)) {
                  ggp.relationToQuery = '曾祖父辈'
                  greatGrandparents.push(ggp)
                  relatedNodeIds.add(ggp.id)
                  newVisibleLinks.push(this.getLink(ggp.id, gp.id))
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
          newVisibleLinks.push(this.getLink(targetNode.id, child.id))
          
          const gcs = this.getChildren(child.id)
          gcs.forEach(gc => {
            if (!relatedNodeIds.has(gc.id)) {
              gc.relationToQuery = '孙辈'
              grandchildren.push(gc)
              relatedNodeIds.add(gc.id)
              newVisibleLinks.push(this.getLink(child.id, gc.id))
              
              const ggcs = this.getChildren(gc.id)
              ggcs.forEach(ggc => {
                if (!relatedNodeIds.has(ggc.id)) {
                  ggc.relationToQuery = '曾孙辈'
                  greatGrandchildren.push(ggc)
                  relatedNodeIds.add(ggc.id)
                  newVisibleLinks.push(this.getLink(gc.id, ggc.id))
                }
              })
            }
          })
        }
      })
      
      newVisibleNodes.push(...grandchildren, ...greatGrandchildren)

      this.layoutNodes(newVisibleNodes, targetNode)

      if (isInitial) {
        this.visibleNodes = newVisibleNodes
        this.visibleLinks = newVisibleLinks
      } else {
        newVisibleNodes.forEach(node => {
          if (!this.visibleNodes.find(n => n.id === node.id)) {
            this.visibleNodes.push(node)
          }
        })
        newVisibleLinks.forEach(link => {
          if (link && !this.visibleLinks.find(l => 
            (l.source === link.source && l.target === link.target) ||
            (l.source === link.target && l.target === link.source)
          )) {
            this.visibleLinks.push(link)
          }
        })
        this.layoutNodes(this.visibleNodes, targetNode)
      }

      this.hasQueried = true
      this.adjustSvgHeight()
    },
    layoutNodes(nodes, targetNode) {
      const generationMap = {}
      nodes.forEach(node => {
        const gen = node.generation
        if (!generationMap[gen]) {
          generationMap[gen] = []
        }
        generationMap[gen].push(node)
      })

      const generations = Object.keys(generationMap).map(Number).sort((a, b) => a - b)
      const nodeWidth = 100
      const nodeHeight = 160
      const startX = this.svgWidth / 2
      let currentY = 60

      generations.forEach(gen => {
        const genNodes = generationMap[gen]
        const totalWidth = genNodes.length * nodeWidth
        const startXOffset = startX - totalWidth / 2 + nodeWidth / 2
        
        genNodes.forEach((node, index) => {
          node.x = startXOffset + index * nodeWidth
          node.y = currentY
        })
        
        currentY += nodeHeight
      })
    },
    adjustSvgHeight() {
      const maxY = Math.max(...this.visibleNodes.map(n => n.y))
      this.svgHeight = maxY + 120
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
    getLink(sourceId, targetId) {
      return this.allLinks.find(l => 
        (l.source === sourceId && l.target === targetId) ||
        (l.source === targetId && l.target === sourceId)
      )
    },
    handleNodeClick(node) {
      this.selectedNode = node
      if (!this.queriedIds.has(node.id)) {
        this.queryNode(node, false)
      }
    },
    getNodeById(id) {
      return this.visibleNodes.find(n => n.id === id) || this.allNodes.find(n => n.id === id)
    },
    getSafeNode(id) {
      const node = this.getNodeById(id)
      return node || { x: 0, y: 0 }
    },
    getNodeRadius(node) {
      return 30
    },
    getNodeColor(node) {
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
      if (!this.selectedNode) return false
      if (this.selectedNode?.id === node.id) return true
      
      if (this.selectedNode) {
        return this.visibleLinks.some(link => 
          (link.source === this.selectedNode.id && link.target === node.id) ||
          (link.target === this.selectedNode.id && link.source === node.id)
        )
      }
      
      return false
    },
    isLinkHighlighted(link) {
      if (!this.selectedNode) return false
      
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
      this.selectedNode = null
      this.searchName = ''
    }
  }
}
</script>

<style scoped>
.relationship {
  padding-bottom: 30px;
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
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }
  25% {
    transform: translate(10px, -10px) scale(1.1);
    opacity: 0.7;
  }
  50% {
    transform: translate(0, -20px) scale(1);
    opacity: 0.6;
  }
  75% {
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
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
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

@keyframes spin {
  to { transform: rotate(360deg); }
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
}

.zoom-btn.reset {
  font-size: 16px;
}

.network-container {
  position: relative;
  overflow-y: auto;
  max-height: 600px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.network-svg {
  width: 100%;
  background: white;
  display: block;
}

.link {
  stroke: url(#linkGradient);
  stroke-width: 2;
  transition: all 0.3s;
}

.link.highlighted {
  stroke: #002fa7;
  stroke-width: 3;
  opacity: 1;
}

.node {
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.node:hover .node-circle {
  stroke-width: 5;
}

.node.selected .node-circle {
  stroke: #002fa7;
  stroke-width: 4;
  filter: url(#nodeShadow);
}

.node.highlighted .node-circle {
  stroke: #002fa7;
  stroke-width: 3;
}

.node.queried .node-circle {
  stroke: #f093fb;
  stroke-width: 4;
}

.node-circle {
  stroke: white;
  stroke-width: 3;
  transition: all 0.2s ease-out;
}

.node-avatar {
  font-size: 24px;
  pointer-events: none;
}

.node-name {
  font-size: 11px;
  fill: #2d3748;
  font-weight: 600;
  pointer-events: none;
}

.node-age {
  font-size: 9px;
  fill: #002fa7;
  font-weight: 500;
  pointer-events: none;
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
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
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

.tips-section {
  padding: 0;
  margin-top: 16px;
}

.tips-card {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%);
  border-radius: 16px;
  padding: 20px;
  border-left: 4px solid #002fa7;
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
}

.info-panel {
  position: fixed;
  bottom: 80px;
  left: 15px;
  right: 15px;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
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
}

.node-detail {
  text-align: center;
}

.detail-avatar {
  font-size: 56px;
  margin-bottom: 12px;
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
</style>
