# MCTI · 你的本命道具

32 道日常情境选择题，以八项独立特质匹配 16 件 Minecraft 道具。包含四种题型、自动保留进度、八维雷达图、命中特质、评语、TOP3、PNG 结果卡与重新测试。

## 本地运行

安装 Node.js 后，在此目录运行 `npm start`，打开 http://127.0.0.1:4173 。无需安装依赖。`npm test` 验证计分、题量、道具可达性和图片资源。

## 修改内容

- `dist/data.js`：题目、答案权重、八维定义、16 件道具档案及评分。
- `dist/app.js`：流程、进度存储、雷达图、分享卡。
- `dist/style.css`：像素视觉与响应式样式。
- `dist/assets`：本地字体、道具图片及材质。
- `docs/design.md`：设计与计分说明。

匹配规则：每维四题等权平均，计算与各道具八维档案的均方根距离，匹配度为 100 减该距离。得分表示本次回答的倾向，未作心理测量信效度验证。16 件道具均可通过实际答题成为第一匹配。

答案只存储于当前浏览器的 localStorage。分享 PNG 在设备上生成，不上传回答。

## 素材

字体：[缝合像素字体](https://github.com/TakWolf/fusion-pixel-font)，OFL 许可详见字体项目与 assets/OFL.txt。纹理：[Minecraft 资源整理](https://github.com/InventivetalentDev/minecraft-assets)，版本 1.21.4，游戏资源属于 Mojang / Microsoft。部分方块图标与潮涌核心图标为组合、绘制的示意图；浮空岛为程序绘制的体素场景。本项目是非官方同人测评。
