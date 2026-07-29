import { useState } from 'react'
import './App.css'

// ---------------------------------------------------------------------------
// 本页为纯前端静态演示，无后端、无持久化。
// 所有内容都携带 source（来源）与 status（确认状态），对应
// docs/DATA_MODEL.md 的 source types / confirmation status 枚举。
// ---------------------------------------------------------------------------

const ENTERPRISE = {
  name: '万华化学',
  source: '客户材料标题',
  status: 'confirmed',
}

const DEPARTMENT = {
  name: '研发部门',
  source: '顾问推断（材料未明确注明部门）',
  status: 'to_be_confirmed',
}

// 前 3 问的回答为示例占位，不来自客户材料，因此单独标记来源类型。
const ANSWERED_QUESTIONS = [
  {
    no: 1,
    group: '组一 · 部门组成与业务范围',
    question: '请介绍部门组织构成、主要职责和业务范围。',
    answer:
      '研发部门负责新材料与新工艺路线的前端探索、配方设计与放大验证。',
    sourceType: 'placeholder',
    source: '示例占位数据（非客户材料）',
    status: 'to_be_confirmed',
  },
  {
    no: 2,
    group: '组一 · 核心 KPI',
    question: '当前部门最核心的 KPI 或管理目标是什么？',
    answer:
      '新产品从立项到中试通过的周期，以及单个项目所需的实验轮次与试错成本。',
    sourceType: 'placeholder',
    source: '示例占位数据（非客户材料）',
    status: 'to_be_confirmed',
  },
  {
    no: 3,
    group: '组二 · 典型业务流程',
    question: '请以一个典型业务场景为例，介绍当前主要业务流程如何运转。',
    answer:
      '需求立项 → 文献与专利调研 → 候选方案设计 → 小试验证 → 放大验证 → 结果复盘。',
    sourceType: 'placeholder',
    source: '示例占位数据（非客户材料）',
    status: 'to_be_confirmed',
  },
]

const CURRENT_QUESTION = {
  no: 4,
  total: 8,
  group: '组二 · 流程、痛点、能力与数字化基础',
  question: '流程中最耗时、最容易出错或最依赖经验的环节是什么？',
  answer:
    '面对广阔化学空间，前端探索与实验高度依赖人工经验，试错成本与资源依赖双高。',
  sourceType: 'customer_quote',
  source: '受访者原话',
  status: 'confirmed',
}

const NEXT_BEST_MOVE = {
  question: '这 14000 种候选化学方案，人工筛选大概需要多长时间？',
  why: '客户只说了“依赖人工经验”，没有量化时间/规模，无法评估 AI 能带来多大提升。',
  northStar: '提升研发前端探索效率',
  slotGap: '候选方案规模与筛选耗时的量化数据',
  caution: '材料中已有该数字，需现场向受访者复核。',
  sourceType: 'ai_inference',
  source: 'AI 基于当前回答生成的建议',
  status: 'to_be_confirmed',
}

const OPPORTUNITY_CARD = {
  title: 'AI 辅助化学候选方案初筛',
  description:
    '从 14000 种候选中，AI 初筛出 156 个潜力选项，再优化至 4 个，交由专家做最终判断。',
  source: '客户材料（万华化学研发AI创新沟通材料）',
  dataStatus: 'confirmed',
  dataStatusNote: '材料原文有对应数据',
  opportunityStatus: 'to_be_confirmed',
  opportunityStatusNote: '机会本身尚未与客户确认',
}

const STATUS_LABEL = {
  confirmed: '已确认',
  to_be_confirmed: '待确认',
}

function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

function Provenance({ source, status, tone }) {
  return (
    <p className="provenance">
      <span className="provenance__key">来源</span>
      <span className="provenance__value">{source}</span>
      <Badge tone={tone}>{STATUS_LABEL[status]}</Badge>
    </p>
  )
}

function App() {
  const [draft, setDraft] = useState(CURRENT_QUESTION.answer)
  const [submitted, setSubmitted] = useState(false)
  const [pendingQuestions, setPendingQuestions] = useState([])

  const adoptNextBestMove = () => {
    if (pendingQuestions.includes(NEXT_BEST_MOVE.question)) return
    setPendingQuestions((list) => [...list, NEXT_BEST_MOVE.question])
  }

  return (
    <div className="mission">
      <header className="topbar">
        <div className="topbar__title">
          <h1>访谈进行页</h1>
          <span className="topbar__sub">Interview Mission Room</span>
        </div>
        <Badge tone="demo">静态演示数据 · 未接后端</Badge>
      </header>

      <main className="grid">
        {/* ---------------------------------------------- 左栏：访谈 Q&A 流 */}
        <section className="col col--qa" aria-label="访谈 Q&A 流">
          <div className="col__head">
            <h2>访谈 Q&amp;A 流</h2>
          </div>

          <div className="identity">
            <div className="identity__row">
              <span className="identity__enterprise">{ENTERPRISE.name}</span>
              <Badge tone="inferred">
                {DEPARTMENT.name}（推断，待确认）
              </Badge>
            </div>
            <p className="identity__note">
              部门为顾问推断，材料未明确注明，需向客户确认。
            </p>
          </div>

          <div className="progress">
            <div className="progress__label">
              <span>
                第 {CURRENT_QUESTION.no} / {CURRENT_QUESTION.total} 问
              </span>
              <span className="progress__group">{CURRENT_QUESTION.group}</span>
            </div>
            <div className="progress__track">
              <div
                className="progress__bar"
                style={{
                  width: `${(CURRENT_QUESTION.no / CURRENT_QUESTION.total) * 100}%`,
                }}
              />
            </div>
          </div>

          <ol className="qa">
            {ANSWERED_QUESTIONS.map((item) => (
              <li key={item.no} className="qa__item qa__item--done">
                <div className="qa__meta">
                  <span className="qa__no">Q{item.no}</span>
                  <span className="qa__group">{item.group}</span>
                  <Badge tone="done">已答</Badge>
                </div>
                <p className="qa__question">{item.question}</p>
                <div className="qa__answer qa__answer--placeholder">
                  <p>{item.answer}</p>
                  <Provenance
                    source={item.source}
                    status={item.status}
                    tone="sample"
                  />
                </div>
              </li>
            ))}

            <li className="qa__item qa__item--current">
              <div className="qa__meta">
                <span className="qa__no">Q{CURRENT_QUESTION.no}</span>
                <span className="qa__group">{CURRENT_QUESTION.group}</span>
                <Badge tone="current">进行中</Badge>
              </div>
              <p className="qa__question">{CURRENT_QUESTION.question}</p>
              <div className="qa__answer qa__answer--quote">
                <span className="qa__quote-tag">客户原话</span>
                <p>{CURRENT_QUESTION.answer}</p>
                <Provenance
                  source={CURRENT_QUESTION.source}
                  status={CURRENT_QUESTION.status}
                  tone="confirmed"
                />
              </div>
            </li>

            {pendingQuestions.map((question) => (
              <li key={question} className="qa__item qa__item--pending">
                <div className="qa__meta">
                  <span className="qa__no">追问</span>
                  <Badge tone="pending">待回答</Badge>
                </div>
                <p className="qa__question">{question}</p>
                <Provenance
                  source={NEXT_BEST_MOVE.source}
                  status={NEXT_BEST_MOVE.status}
                  tone="inferred"
                />
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------ 中栏：受访者回答输入 */}
        <section className="col col--input" aria-label="受访者回答输入">
          <div className="col__head">
            <h2>受访者回答</h2>
          </div>

          <p className="input__context">
            正在回答 Q{CURRENT_QUESTION.no}：{CURRENT_QUESTION.question}
          </p>

          <label className="input__label" htmlFor="answer">
            回答内容（可编辑）
          </label>
          <textarea
            id="answer"
            className="input__area"
            value={draft}
            rows={10}
            onChange={(event) => {
              setDraft(event.target.value)
              setSubmitted(false)
            }}
          />

          <div className="input__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setSubmitted(true)}
            >
              提交回答
            </button>
            <span className="input__count">{draft.length} 字</span>
          </div>

          {submitted && (
            <p className="input__toast">
              已记录到本地演示状态，未写入后端。
            </p>
          )}

          <p className="input__hint">
            提交后由 AI 判断回答是否充分、是否偏离北极星，并更新右侧 Next Best
            Move。当前为静态演示，判断逻辑尚未实现。
          </p>
        </section>

        {/* -------------------------------------- 右栏：Next Best Move + 机会卡 */}
        <section className="col col--action" aria-label="Next Best Move">
          <div className="col__head">
            <h2>Next Best Move</h2>
          </div>

          <article className="nbm">
            <div className="nbm__tag">现场最高优先级</div>
            <p className="nbm__question">{NEXT_BEST_MOVE.question}</p>

            <dl className="nbm__list">
              <div className="nbm__row">
                <dt>为什么问</dt>
                <dd>{NEXT_BEST_MOVE.why}</dd>
              </div>
              <div className="nbm__row">
                <dt>服务哪个北极星</dt>
                <dd>{NEXT_BEST_MOVE.northStar}</dd>
              </div>
              <div className="nbm__row">
                <dt>补哪个槽位缺口</dt>
                <dd>{NEXT_BEST_MOVE.slotGap}</dd>
              </div>
            </dl>

            <p className="nbm__caution">{NEXT_BEST_MOVE.caution}</p>

            <Provenance
              source={NEXT_BEST_MOVE.source}
              status={NEXT_BEST_MOVE.status}
              tone="inferred"
            />

            <button
              type="button"
              className="btn btn--accent"
              onClick={adoptNextBestMove}
              disabled={pendingQuestions.includes(NEXT_BEST_MOVE.question)}
            >
              {pendingQuestions.includes(NEXT_BEST_MOVE.question)
                ? '已加入左侧 Q&A 流'
                : '采纳并加入 Q&A 流'}
            </button>
          </article>

          <article className="opp">
            <div className="opp__head">
              <h3>候选需求</h3>
              <Badge tone="pending">AI 机会卡 · 待确认</Badge>
            </div>

            <p className="opp__title">{OPPORTUNITY_CARD.title}</p>
            <p className="opp__desc">{OPPORTUNITY_CARD.description}</p>

            <div className="opp__foot">
              <p className="provenance">
                <span className="provenance__key">来源</span>
                <span className="provenance__value">
                  {OPPORTUNITY_CARD.source}
                </span>
                <Badge tone="confirmed">已确认</Badge>
              </p>
              <ul className="opp__status">
                <li>
                  <Badge tone="confirmed">支撑数据 已确认</Badge>
                  <span>{OPPORTUNITY_CARD.dataStatusNote}</span>
                </li>
                <li>
                  <Badge tone="pending">机会本身 待确认</Badge>
                  <span>{OPPORTUNITY_CARD.opportunityStatusNote}</span>
                </li>
              </ul>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
