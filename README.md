# MCTI · 你的本命道具

30 道参考公开IPIP题库筛选并改编的日常选择，基于大五人格框架匹配 16 件 Minecraft 道具。10 道四项情境单选、5 道二选一、15 道五档选择，交错排列。包含进度恢复、五维评分图、命中理由、TOP3、PNG 预览下载和重测。主卡和TOP3使用同一套余弦轮廓匹配度，同时保留原绝对契合度，提供五维雷达图和以日常性格为主的解读。

## 本地运行

安装 Node.js 后，在此目录运行 `npm start`，打开 http://127.0.0.1:4173 。无需安装依赖。`npm test` 验证计分、题量、道具可达性和图片资源。

## 修改内容

- `dist/questionnaire.js`：题目原文与出处、五维及侧面定义、题型归一化与反向计分。
- `dist/personality.js`：偶校验原型配置、点积、余弦方向匹配、绝对契合度、稳定Softmax及区分度。
- `dist/data.js`：16 件道具档案与计分入口。
- `dist/interpretation.js`：按真实五维倾向生成性格解读，不描述计算过程。
- `dist/app.js`：流程、进度存储、雷达图、分享卡。
- `dist/style.css`：像素视觉与响应式样式。
- `dist/assets`：本地字体、道具图片及材质。
- `docs/design.md`：设计与计分说明。

匹配规则及局限见 [算法说明](docs/design.md)。题目来源、筛选理由与改编说明见 [来源记录](docs/question-sources.md)。本版经筛题、翻译及题型改编，不能沿用完整原量表的信效度声明。`node scripts/compare-algorithms.mjs` 可复现模拟对比，输出 `docs/simulation-results.json` 与完整结果结构 `docs/result-example.json`。新旧量表使用独立存储键，不混用回答。

答案只存储于当前浏览器的 localStorage。分享 PNG 在设备上生成，不上传回答。

## 素材

道具图标使用 [Minecraft Wiki](https://minecraft.wiki/) 收录的原版游戏物品栏 Invicon 精灵图，通过 Wiki 2025-11 存档取得。保留原始 16×16 或 32×32 像素尺寸，动画材质使用首帧；存档中的 WebP 只转换编码为 PNG。每张图的文件名、原始页面、存档地址和校验值记录于 `dist/assets/inventory-sources.json`。重新获取图标可运行 `fetch-inventory-icons.py`（需要 Python 与 Pillow）。

字体：[缝合像素字体](https://github.com/TakWolf/fusion-pixel-font)，OFL 许可详见字体项目与 assets/OFL.txt。浮空岛为程序绘制的体素场景，其纹理来自 [Minecraft 资源整理](https://github.com/InventivetalentDev/minecraft-assets) 1.21.4。游戏资源属于 Mojang / Microsoft。本项目是非官方同人测评。
