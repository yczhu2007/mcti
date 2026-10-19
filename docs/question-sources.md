# 题库检索与筛选记录

## 检查的公开项目和原始题库

| 来源 | 检查结果 | 本站采用方式 |
| --- | --- | --- |
| [rubynor/bigfive-web](https://github.com/rubynor/bigfive-web) / [questions模块](https://github.com/rubynor/bigfive-web/tree/master/packages/questions) | 以Johnson 120题IPIP-NEO为基础，按domain、facet、keyed保存题目；项目声明MIT许可，中文列为社区翻译 | 参考可追溯的题目结构，实际条目从IPIP原站核对；未直接复制其中文翻译或程序 |
| [kholia/IPIP-NEO-PI](https://github.com/kholia/IPIP-NEO-PI) | 120题离线测评项目，README声明Public Domain并链接IPIP许可 | 交叉确认使用的公开题库与计分方向 |
| [IPIP-NEO-120官方条目与计分键](https://ipip.ori.org/30FacetNEO-PI-RItems.htm) | 五维各六个侧面，四题一侧面，共120题，正反向明示 | 选取29条，避开直接同义复述，覆盖不同日常行为 |
| [Big-Five Factor Markers官方计分键](https://ipip.ori.org/newBigFive5broadKey.htm) | 提供广义五维条目及方向 | 另选“Spend time reflecting on things.”作开放性反思题，避免政治态度题 |
| [IPIP施测建议](https://ipip.ori.org/new_ipip-50-item-scale.htm) | 允许翻译、修改题目和响应格式，建议混合维度和正反方向 | 五维交错，保留反向题；不把合法使用等同于改编版已验证 |
| [IPIP授权](https://ipip.ori.org/newPermission.htm) | 条目、量表和题库为公有领域，可用于商业及非商业用途 | 使用英文原条目，独立制作中文与选项改编 |

这不是对上述项目整体质量的排名。项目功能和题库授权已经检查；没有声称它们的社区中文翻译经过独立心理测量学验证。

## 筛选原则与交付

保留30题、每维6题，以及10道四项情境单选、5道二选一、15道五档选择。优先让每维涉及不同侧面，剔除直接同义反复；不选政治候选人偏好、物质滥用等不适合游戏道具趣味测评的条目，也不把学术词汇量当作本站开放性的主要依据。N按神经质方向计分，页面名为“情绪敏感度”，不解释为能力或疾病。

`dist/questionnaire.js`中的每题保留：`original`英文原文、`source`原始页面、`facet`来源侧面、`keyed`原计分方向、`reverse`、中文`text`及改编选项。`docs/selected-question-sources.json`是相同信息的独立清单。

开放性的六题涉及想象、审美、尝新、观念探索、反思与内在感受；反思题来自广义标记量表，其余题来自NEO。其余四维各从六个NEO侧面选取一题。每题保留原计分方向，但题数缩减、中文翻译和混合响应格式均构成改编。本版不等同于完整IPIP-NEO-120、Mini-IPIP或验证过的中文版，不输出正式分量表、临床结论或常模百分位。

## 性格文案调整（humanizer复核）

旧写法：“开放性偏高、宜人性偏高对这件道具的原型得分贡献较大。”

初稿：“你有丰富的好奇心，同时拥有认真负责的内在特质，展现出独特的探索方式。”

复核发现：初稿仍然空泛，用“丰富、独特”等词夸赞，却没讲读者在生活里会怎样。最终改为具体习惯：

“你习惯把要紧的事提前理顺，答应以后也会惦记着把它做完。独处和熟悉的关系更容易让你恢复精力，你喜欢按自己的节奏参与相处。你习惯先把事情准备好，再用行动让别人放心，也享受安静做事的过程。”

正式文案依据五维真实分数选择，不固定套用这一段；高、中、低各有相应描述。图表可以均衡，文字会承认中间倾向，不通过夸张定性制造辨识度。性格解读和创作性的物品联想分开。
