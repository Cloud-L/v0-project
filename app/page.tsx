"use client"

import { AlertConfigForm } from "@/components/alert-config-form"
import { useState } from "react"
import { Check } from "lucide-react"

export default function Page() {
  const [submitted, setSubmitted] = useState(false)
  const [config, setConfig] = useState<unknown>(null)

  const handleSubmit = (data: unknown) => {
    setConfig(data)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题区域 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            数据中心报表工具
          </h1>
          <p className="text-muted-foreground">
            指标预警设置 - 支持分层预警配置
          </p>
        </div>

        {/* 主内容区域 */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* 左侧：配置表单 */}
          <div className="flex justify-center lg:justify-end">
            <AlertConfigForm onSubmit={handleSubmit} />
          </div>

          {/* 右侧：功能说明 */}
          <div className="space-y-6">
            {/* 新功能说明卡片 */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  新
                </span>
                分层预警功能
              </h2>
              
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  全新的分层预警功能允许您基于平均值对数据进行多层级颜色标识，帮助快速识别数据分布情况。
                </p>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">功能特点：</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>支持高于/低于平均值分别配置</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>每层可自定义百分比范围</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>支持2-4个分层级别</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>预设颜色与自定义颜色可选</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>实时预览分层效果</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="font-medium text-foreground">使用场景：</h3>
                  <p>
                    适用于需要对指标数据进行精细化监控的场景，例如销售业绩分析、KPI达成率监控、异常值检测等。
                  </p>
                </div>
              </div>
            </div>

            {/* 示例说明 */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="font-medium text-foreground mb-3">配置示例</h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
                <div>
                  <span className="text-foreground font-medium">高于平均值：</span>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• 前 50%（顶尖表现）→ 红色</li>
                    <li>• 后 50%（良好表现）→ 橙色</li>
                  </ul>
                </div>
                <div>
                  <span className="text-foreground font-medium">低于平均值：</span>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• 前 50%（接近平均）→ 黄色</li>
                    <li>• 后 50%（需关注）→ 绿色</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 提交反馈 */}
            {submitted && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">配置已保存</p>
                  <p className="text-sm text-muted-foreground">
                    预警规则将应用到相关指标
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部对比说明 */}
        <div className="mt-12 bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-medium text-foreground mb-4">
            预警类型对比
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">类型</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">说明</th>
                  <th className="text-left py-3 px-4 font-medium text-foreground">适用场景</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">区间外</td>
                  <td className="py-3 px-4">数值超出指定范围时预警</td>
                  <td className="py-3 px-4">异常值检测</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">区间内</td>
                  <td className="py-3 px-4">数值在指定范围内时预警</td>
                  <td className="py-3 px-4">特定区间监控</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">指标值</td>
                  <td className="py-3 px-4">达到特定阈值时预警</td>
                  <td className="py-3 px-4">目标达成监控</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">平均值</td>
                  <td className="py-3 px-4">基于平均值单色预警</td>
                  <td className="py-3 px-4">简单均值对比</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1">
                      分层预警
                      <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">新</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">基于平均值多层级颜色预警</td>
                  <td className="py-3 px-4">精细化数据分析、绩效评估</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
