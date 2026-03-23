"use client"

import { useState } from "react"
import { ChevronDown, Plus, Trash2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// 预设颜色
const PRESET_COLORS = [
  { value: "#F97316", label: "橙色" },
  { value: "#FBBF24", label: "黄色" },
  { value: "#A3E635", label: "浅绿" },
  { value: "#22C55E", label: "绿色" },
  { value: "#EF4444", label: "红色" },
  { value: "#3B82F6", label: "蓝色" },
]

// 预警类型
type AlertType = "区间外" | "区间内" | "指标值" | "平均值" | "分层预警"

interface LayerConfig {
  id: string
  percentage: number
  color: string
}

interface AlertConfigFormProps {
  onSubmit?: (config: AlertConfig) => void
}

interface AlertConfig {
  indicatorName: string
  alertType: AlertType
  rangeMin?: number
  rangeMax?: number
  targetValue?: number
  alertColor?: string
  layeredConfig?: {
    aboveAverage: LayerConfig[]
    belowAverage: LayerConfig[]
  }
}

function ColorPicker({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (color: string) => void
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {PRESET_COLORS.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onChange(color.value)}
          className={cn(
            "w-6 h-6 rounded-full transition-all duration-150",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            value === color.value && "ring-2 ring-offset-2 ring-foreground"
          )}
          style={{ backgroundColor: color.value }}
          title={color.label}
        />
      ))}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded cursor-pointer border border-border"
        title="自定义颜色"
      />
    </div>
  )
}

function LayerConfigRow({
  layer,
  onUpdate,
  onDelete,
  canDelete,
  isFirst,
  previousPercentage,
}: {
  layer: LayerConfig
  onUpdate: (layer: LayerConfig) => void
  onDelete: () => void
  canDelete: boolean
  isFirst: boolean
  previousPercentage: number
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm text-muted-foreground w-8">
          {previousPercentage}%
        </span>
        <span className="text-muted-foreground">-</span>
        <Input
          type="number"
          min={previousPercentage + 1}
          max={100}
          value={layer.percentage}
          onChange={(e) =>
            onUpdate({ ...layer, percentage: parseInt(e.target.value) || 0 })
          }
          className="w-20 h-8 text-center"
        />
        <span className="text-sm text-muted-foreground">%</span>
      </div>
      <ColorPicker
        value={layer.color}
        onChange={(color) => onUpdate({ ...layer, color })}
      />
      {canDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

function LayerSection({
  title,
  description,
  layers,
  onUpdateLayers,
}: {
  title: string
  description: string
  layers: LayerConfig[]
  onUpdateLayers: (layers: LayerConfig[]) => void
}) {
  const addLayer = () => {
    const lastLayer = layers[layers.length - 1]
    if (lastLayer && lastLayer.percentage < 100) {
      const newPercentage = Math.min(
        lastLayer.percentage + Math.floor((100 - lastLayer.percentage) / 2),
        100
      )
      onUpdateLayers([
        ...layers,
        {
          id: crypto.randomUUID(),
          percentage: newPercentage,
          color: PRESET_COLORS[layers.length % PRESET_COLORS.length].value,
        },
      ])
    }
  }

  const updateLayer = (index: number, layer: LayerConfig) => {
    const newLayers = [...layers]
    newLayers[index] = layer
    onUpdateLayers(newLayers)
  }

  const deleteLayer = (index: number) => {
    if (layers.length > 1) {
      onUpdateLayers(layers.filter((_, i) => i !== index))
    }
  }

  const canAddMore = layers.length < 4 && layers[layers.length - 1]?.percentage < 100

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="bg-muted/50 rounded-lg p-3 space-y-1">
        {layers.map((layer, index) => (
          <LayerConfigRow
            key={layer.id}
            layer={layer}
            onUpdate={(l) => updateLayer(index, l)}
            onDelete={() => deleteLayer(index)}
            canDelete={layers.length > 1}
            isFirst={index === 0}
            previousPercentage={index === 0 ? 0 : layers[index - 1].percentage}
          />
        ))}
        {canAddMore && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-primary hover:text-primary hover:bg-primary/10"
            onClick={addLayer}
          >
            <Plus className="h-4 w-4 mr-1" />
            添加分层
          </Button>
        )}
      </div>
    </div>
  )
}

export function AlertConfigForm({ onSubmit }: AlertConfigFormProps) {
  const [indicatorName, setIndicatorName] = useState("")
  const [alertType, setAlertType] = useState<AlertType>("分层预警")
  const [rangeMin, setRangeMin] = useState("")
  const [rangeMax, setRangeMax] = useState("")
  const [targetValue, setTargetValue] = useState("")
  const [alertColor, setAlertColor] = useState(PRESET_COLORS[0].value)

  // 分层预警配置
  const [aboveLayers, setAboveLayers] = useState<LayerConfig[]>([
    { id: "above-1", percentage: 50, color: "#EF4444" },
    { id: "above-2", percentage: 100, color: "#F97316" },
  ])
  const [belowLayers, setBelowLayers] = useState<LayerConfig[]>([
    { id: "below-1", percentage: 50, color: "#FBBF24" },
    { id: "below-2", percentage: 100, color: "#22C55E" },
  ])

  const handleSubmit = () => {
    const config: AlertConfig = {
      indicatorName,
      alertType,
    }

    if (alertType === "区间内" || alertType === "区间外") {
      config.rangeMin = parseFloat(rangeMin)
      config.rangeMax = parseFloat(rangeMax)
      config.alertColor = alertColor
    } else if (alertType === "指标值") {
      config.targetValue = parseFloat(targetValue)
      config.alertColor = alertColor
    } else if (alertType === "平均值") {
      config.alertColor = alertColor
    } else if (alertType === "分层预警") {
      config.layeredConfig = {
        aboveAverage: aboveLayers,
        belowAverage: belowLayers,
      }
    }

    onSubmit?.(config)
    console.log("提交配置:", config)
  }

  return (
    <div className="w-full max-w-md bg-card rounded-xl shadow-lg border border-border overflow-hidden">
      {/* 头部 */}
      <div className="bg-primary px-4 py-3">
        <h3 className="text-base font-medium text-primary-foreground">
          指标预警设置
        </h3>
      </div>

      {/* 表单内容 */}
      <div className="p-4 space-y-4">
        {/* 指标别名 */}
        <div className="grid grid-cols-[80px_1fr] items-center gap-3">
          <Label className="text-sm text-foreground">指标别名：</Label>
          <Input
            placeholder="请输入"
            value={indicatorName}
            onChange={(e) => setIndicatorName(e.target.value)}
            className="h-9"
          />
        </div>

        {/* 指标预警类型 */}
        <div className="grid grid-cols-[80px_1fr] items-center gap-3">
          <Label className="text-sm text-foreground">指标预警：</Label>
          <Select value={alertType} onValueChange={(v) => setAlertType(v as AlertType)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="区间外">区间外</SelectItem>
              <SelectItem value="区间内">区间内</SelectItem>
              <SelectItem value="指标值">指标值</SelectItem>
              <SelectItem value="平均值">平均值</SelectItem>
              <SelectItem value="分层预警">分层预警（平均值）</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 区间配置 */}
        {(alertType === "区间内" || alertType === "区间外") && (
          <>
            <div className="grid grid-cols-[80px_1fr] items-center gap-3">
              <Label className="text-sm text-foreground">
                <span className="text-destructive">*</span> 区间：
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="最小值"
                  value={rangeMin}
                  onChange={(e) => setRangeMin(e.target.value)}
                  className="h-9 flex-1"
                  type="number"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  placeholder="最大值"
                  value={rangeMax}
                  onChange={(e) => setRangeMax(e.target.value)}
                  className="h-9 flex-1"
                  type="number"
                />
              </div>
            </div>
            <div className="grid grid-cols-[80px_1fr] items-center gap-3">
              <Label className="text-sm text-foreground">预警颜色：</Label>
              <ColorPicker value={alertColor} onChange={setAlertColor} />
            </div>
          </>
        )}

        {/* 指标值配置 */}
        {alertType === "指标值" && (
          <>
            <div className="grid grid-cols-[80px_1fr] items-center gap-3">
              <Label className="text-sm text-foreground">
                <span className="text-destructive">*</span> 指标值：
              </Label>
              <Input
                placeholder="请输入"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="h-9"
                type="number"
              />
            </div>
            <div className="grid grid-cols-[80px_1fr] items-center gap-3">
              <Label className="text-sm text-foreground">预警颜色：</Label>
              <ColorPicker value={alertColor} onChange={setAlertColor} />
            </div>
          </>
        )}

        {/* 简单平均值配置 */}
        {alertType === "平均值" && (
          <div className="grid grid-cols-[80px_1fr] items-center gap-3">
            <Label className="text-sm text-foreground">预警颜色：</Label>
            <ColorPicker value={alertColor} onChange={setAlertColor} />
          </div>
        )}

        {/* 分层预警配置 - 新功能 */}
        {alertType === "分层预警" && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
              <Info className="h-4 w-4 flex-shrink-0" />
              <span>
                基于平均值进行分层预警，可为高于/低于平均值的不同百分比区间设置不同颜色
              </span>
            </div>

            {/* 高于平均值 */}
            <LayerSection
              title="高于平均值"
              description="配置高于平均值数据的分层颜色，按数值从高到低排列，设置各层级占比及对应颜色"
              layers={aboveLayers}
              onUpdateLayers={setAboveLayers}
            />

            {/* 分隔线 - 平均值指示 */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted rounded">
                平均值
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* 低于平均值 */}
            <LayerSection
              title="低于平均值"
              description="配置低于平均值数据的分层颜色，按数值从高到低排列，设置各层级占比及对应颜色"
              layers={belowLayers}
              onUpdateLayers={setBelowLayers}
            />

            {/* 预览 */}
            <div className="pt-2">
              <Label className="text-sm font-medium text-foreground mb-2 block">
                预览效果
              </Label>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="flex flex-col gap-1">
                  {/* 高于平均值预览 */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16">高于均值</span>
                    <div className="flex-1 flex h-6 rounded overflow-hidden">
                      {aboveLayers.map((layer, index) => {
                        const prevPercentage = index === 0 ? 0 : aboveLayers[index - 1].percentage
                        const width = layer.percentage - prevPercentage
                        return (
                          <div
                            key={layer.id}
                            className="flex items-center justify-center text-xs text-white font-medium"
                            style={{
                              backgroundColor: layer.color,
                              width: `${width}%`,
                            }}
                          >
                            {width >= 20 && `${prevPercentage}-${layer.percentage}%`}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {/* 低于平均值预览 */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16">低于均值</span>
                    <div className="flex-1 flex h-6 rounded overflow-hidden">
                      {belowLayers.map((layer, index) => {
                        const prevPercentage = index === 0 ? 0 : belowLayers[index - 1].percentage
                        const width = layer.percentage - prevPercentage
                        return (
                          <div
                            key={layer.id}
                            className="flex items-center justify-center text-xs text-white font-medium"
                            style={{
                              backgroundColor: layer.color,
                              width: `${width}%`,
                            }}
                          >
                            {width >= 20 && `${prevPercentage}-${layer.percentage}%`}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 确定按钮 */}
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="link"
            className="text-primary hover:text-primary/80"
            onClick={handleSubmit}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}
