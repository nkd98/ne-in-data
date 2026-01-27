import type { Article } from '@/lib/types';

const article: Article = {
  slug: 'north-east-youth-employment',
  title: 'Youth Employment in Northeast India',
  subtitle:
    'A state-wise analysis of how young people enter the labour force, experience unemployment, and the kinds of jobs they work in',
  authorIds: ['niruj'],
  topicIds: ['employment'],
  status: 'published',
  publishedAt: '2026-01-27',
  updatedAt: '2026-01-27',
  readingTime: 4,
  compactBlocks: true,
  seo: {
    description:
      'A state-wise analysis of youth employment in Northeast India, examining labour force participation, unemployment, and the types of jobs young people work in.',
  },
  heroImage: {
    id: 'assam-tea-landscape',
    alt: 'Aerial view of tea plantations showing both small holdings and large estates in Assam',
  },
  blocks: [
    {
      type: 'intro',
      content:
        'Youth employment outcomes are often discussed using unemployment rates alone. But unemployment by itself does not tell us why young people are without work. Looking separately at participation, unemployment, and job type helps clarify where the constraint lies.',
    },
    {
      type: 'p',
      content:
        'This article examines youth employment in the Northeast by analysing these stages in sequence. Using data from the Periodic Labour Force Survey (PLFS), it focuses on young people aged 15 to 29 and asks three questions: are young people entering the labour force, are they able to find work once they do, and what kinds of jobs are available to them.',
    },
    {
      type: 'h2',
      content: 'Are young people entering the labour force?',
    },
    {
      type: 'p',
      content:
        'The labour force participation rate (LFPR) shows how many people are part of the labour force. The labour force includes people who are working and people who are not working but are actively looking for work. People who are studying full time, managing household work, or not seeking work are counted outside the labour force.',
    },
    {
      type: 'p',
      content:
        'Before looking at unemployment, it is important to know how many people are entering the labour force in the first place. LFPR helps us answer this question.',
    },
    {
      type: 'chart',
      visualId: 'ne-youth-lfpr',
    },
    {
      type: 'p',
      content:
        'The chart shows that entry into the labour force differs widely across the Northeast. In some states, such as Mizoram, less than 30% of young people are part of the labour force. In others, such as Meghalaya, more than 60% of youth have already entered it. With the national average at around 47%, Northeast states lie on both sides of the countrywide level.',
    },
    {
      type: 'p',
      content:
        'This variation shows that youth employment in the Northeast does not begin from the same starting point everywhere. In some states, many young people enter the labour force early. In others, far fewer do. The next question, then, is straightforward: when young people do enter the labour force, are they able to find work?',
    },
    {
      type: 'h2',
      content: 'What happens after young people enter the labour market?',
    },
    {
      type: 'p',
      content:
        'The unemployment rate measures the share of people in the labour force who do not have a job but are actively trying to find one. In simple terms, it counts people who want to work and are looking for work, but have not been able to find a job yet. People who are not looking for work at all are not counted as unemployed.',
    },
    {
      type: 'p',
      content:
        'While participation tells us how many young people are entering the labour force, unemployment tells us what happens to those who do.',
    },
    {
      type: 'chart',
      visualId: 'ne-youth-unemployment',
    },
    {
      type: 'p',
      content:
        'The chart shows large differences in youth unemployment across Northeast states. At one end, Nagaland stands out with youth unemployment close to 30%, meaning nearly three out of ten young people in the labour force are unable to find work. Manipur and Arunachal Pradesh also record high youth unemployment, above 20%, well above levels seen in several other Northeast states, and higher than the national average of around 10%.',
    },
    {
      type: 'p',
      content:
        'In contrast, states such as Sikkim and Tripura show much lower youth unemployment, below 10%. Meghalaya falls in between. Despite having high youth labour force participation, its unemployment rate remains elevated compared to many other states. This indicates that in several states, young people are entering the labour force but are not being absorbed into jobs at the same pace.',
    },
    {
      type: 'p',
      content:
        'Taken together with the participation data, this pattern points to an important distinction across states. In some cases, low unemployment goes hand in hand with low participation, suggesting that fewer young people are entering the labour force to begin with. In others, high unemployment appears alongside relatively high participation, indicating that many young people are actively seeking work but are unable to find it. This leads to the next question: when young people do find work, what kinds of jobs do they have?',
    },
    {
      type: 'h2',
      content: 'What kind of jobs do working youth have?',
    },
    {
      type: 'p',
      content:
        'To understand what kind of jobs young people are doing, the data groups employment into three broad categories: self-employment, regular salaried work, and casual work. Self-employed workers include those who run their own small businesses or farms, as well as those who work in family enterprises without a fixed wage; their incomes often depend on daily or seasonal activity rather than a regular salary.',
    },
    {
      type: 'p',
      content:
        'Regular salaried workers are employed by an organisation or individual and receive a steady wage or salary, usually offering more predictable income and greater job stability. Casual workers, by contrast, are hired on a short-term or daily basis for specific tasks, with irregular work and little job security.',
    },
    {
      type: 'chart',
      visualId: 'ne-youth-job-types',
    },
    {
      type: 'p',
      content:
        'The chart shows that youth employment in most Northeast states is heavily concentrated in self-employment. Regular salaried employment makes up a relatively small share of youth jobs across most Northeast states. Nationally, about 27% of working youth are in regular salaried employment, but most Northeast states cluster well below this level, with Sikkim standing apart from the rest.',
    },
    {
      type: 'p',
      content:
        'Casual employment shows wide variation across states, ranging from very low levels in some to more than one-third of youth employment in others. However, low casual employment does not necessarily signal better job quality. In many cases, it reflects a shift toward self-employment rather than wider access to stable salaried jobs.',
    },
    {
      type: 'h2',
      content: 'What the evidence suggests',
    },
    {
      type: 'p',
      content:
        'Taken together, the evidence points to a gap between entering the labour force and finding stable work. In several Northeast states, many young people are already part of the labour force, yet unemployment remains high and regular salaried jobs are limited. This suggests that the main issue is not whether young people are willing to work. Instead, the difficulty lies in what happens after they enter. Many young people are able to find some form of work, but this work is often self-employment or other less stable arrangements, with limited access to regular salaried jobs. As a result, the labour market struggles to absorb young people into stable and secure employment.',
    },
    {
      type: 'sources',
      content: 'Source: Periodic Labour Force Survey (PLFS) 2023-24.',
    },
  ],
  relatedArticleIds: ['north-east-road-stats', 'north-east-education-ger'],
};

export default article;
