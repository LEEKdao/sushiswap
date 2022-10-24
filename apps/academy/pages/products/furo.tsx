import { LinkIcon } from '@heroicons/react/24/outline'
import { Button, classNames, Container, Link, Typography } from '@sushiswap/ui'
import boardImg from 'common/assets/board.png'
import furoImg from 'common/assets/furo-img.png'
import {
  ProductArticles,
  ProductBackground,
  ProductCards,
  ProductFaq,
  ProductStats,
  ProductTechnicalDoc,
} from 'common/components'
import { defaultSidePadding } from 'common/helpers'
import { AcademyIcon, MoneyBagIcon, MoneyHandIcon, MoneyTreeIcon, PuzzlePieceIcon, TilesIcon } from 'common/icons'
import { getLatestAndRelevantArticles, getProducts } from 'lib/api'
import { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import { FC } from 'react'
import useSWR from 'swr'

import { ArticleEntity } from '.mesh'

const productSlug = 'furo'
const color = '#EB72FF'
const accentColor = '#B341C6'
const productStats = [
  { value: '20', name: 'Projects Launched' },
  { value: '$500m', name: 'Funds Raised' },
  { value: '13k', name: 'Users Participated' },
  { value: '$4m', name: 'Volume Generated' },
]

const cards = [
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={TilesIcon} />,
    title: 'Plug ‘n Play',
    subtitle: 'Furo saves you time from having to do  contract deployments yourself.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyTreeIcon} />,
    title: 'Intuitive UI',
    subtitle: 'See the vesting schedules and progress in an easy-to-use dashboard.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyHandIcon} />,
    title: 'Integration Possibilities',
    subtitle: 'Furo minimizes admin by integrating directly into your existing DAO or DeFi tooling.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={PuzzlePieceIcon} />,
    title: 'NFT Composability',
    subtitle:
      'NFT tokenization on Furo allows our users to utilize their future payments in lending and borrowing money market protocols.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyBagIcon} />,
    title: 'Passive Income',
    subtitle:
      'All Furo subproducts are built upon BentoBox; all capital stored in Furo will be automatically earning yield.',
  },
  {
    Icon: () => <AcademyIcon color={accentColor} Icon={MoneyBagIcon} />,
    title: 'Sushi Ecosystem',
    subtitle: 'Furo is fully open source and integrated into the Sushi ecosystem and our suite of products.',
  },
]

const faq = [
  {
    question: 'What is Trident and what Pool types does it support?',
    answer: (
      <>
        <Typography>
          Trident is a production framework for building and deploying AMMs, but it is not an AMM itself. While AMMs can
          be created using the Trident code, there isn’t a specific AMM at the center of Trident. Instead, there is a
          framework for creating any AMM anyone would ever need.
        </Typography>
        <Typography className="mt-9">Trident is able to produce the following pool types:</Typography>
        <ul className="list-disc list-inside">
          <li>
            <Typography weight={700} className="text-white" as="span">
              Classic pool{' '}
            </Typography>
            <Typography as="span">
              = constant product pool (x * y = k). Classic pools are composed 50% of one token and 50% of another.
              They’re best for pairing tokens that are unpredictable.
            </Typography>
          </li>
          <li>
            <Typography weight={700} className="text-white" as="span">
              Concentrated pool{' '}
            </Typography>
            <Typography as="span">
              = these pools also use two tokens. The difference is that the liquidity in each pool is determined by the
              ranges set by the pool creator.
            </Typography>
          </li>
          <li>
            <Typography weight={700} className="text-white" as="span">
              Stable pools{' '}
            </Typography>
            <Typography as="span">
              = are ideal for pooling “like-kind” assets. These tokens are usually stable coins like USDC and USDT, or
              other pegged tokens like ETH and stETH, or renBTC and WBTC.
            </Typography>
          </li>
          <li>
            <Typography weight={700} className="text-white" as="span">
              Index pools{' '}
            </Typography>
            <Typography as="span">
              = these pools are usually used to create baskets of assets or decentralized index funds; hence the name.
              These pools can be made of any percentage of tokens equalling 100.
            </Typography>
          </li>
        </ul>
      </>
    ),
  },
]

export const getStaticProps = async () => {
  const data = await getProducts({ filters: { slug: { eq: productSlug } } })
  const product = data?.products?.data?.[0].attributes

  return { props: product }
}

const ProductPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  name,
  longName,
  url,
  description,
  slug,
  relevantArticleIds,
}) => {
  const { data, isValidating } = useSWR(
    [`/bentobox-articles`],
    async () => await getLatestAndRelevantArticles(slug, relevantArticleIds),
    { revalidateOnFocus: false, revalidateIfStale: false, revalidateOnReconnect: false }
  )

  const latestArticles = (data?.articles?.data ?? []) as ArticleEntity[]
  const relevantArticles = (data?.relevantArticles?.data ?? []) as ArticleEntity[]

  return (
    <>
      <Container maxWidth="6xl" className={classNames('mx-auto pt-10', defaultSidePadding)}>
        <ProductBackground color={color} />
        <section className="py-[75px] relative">
          <div className="grid md:grid-cols-2">
            <div>
              {longName.split('-').map((name, i) => (
                <h1 key={i} className="text-6xl font-bold leading-[78px]">
                  {name}
                </h1>
              ))}
              <h3 className="mt-2 text-2xl font-medium text-gray-500">{description}</h3>
              <Link.External href={url}>
                <Button
                  size="lg"
                  className="mt-16 rounded-lg"
                  startIcon={<LinkIcon width={20} height={20} strokeWidth={2} />}
                >
                  <Typography weight={500}>Linking to farm</Typography>
                </Button>
              </Link.External>
            </div>
            <div className="md:block hidden">
              <Image src={furoImg} unoptimized alt="furo-img" />
            </div>
          </div>

          <ProductStats productStats={productStats} />
        </section>
      </Container>

      <Container maxWidth="6xl" className={classNames('mx-auto pb-24', defaultSidePadding)}>
        <section className="py-[75px] grid grid-rows-3 gap-[70px]">
          <div className="grid items-center grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10">
            <div>
              <h3 className="text-4xl text-slate-50">The BentoBox</h3>
              <p className="text-lg text-slate-400">
                {
                  "All of the funds on Trident are also available to be applied to approved strategies in the BentoBox. This feature is made possible by Bento's empirical accounting method..."
                }
              </p>
            </div>
            <Image src={boardImg} width={360} height={320} unoptimized objectFit="scale-down" alt="bentobox" />
          </div>
          <div className="grid items-center grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10">
            <Image src={boardImg} width={360} height={320} unoptimized objectFit="scale-down" alt="tines" />
            <div>
              <h3 className="text-4xl text-slate-50">The Tines Router</h3>
              <p className="text-lg text-slate-400">
                {
                  'Tines is a Smart Ordering Router (SOR) that is responsible for managing all the swaps on Trident. When the final phase of Trident is complete, Tines will be the only router in existence...'
                }
              </p>
            </div>
          </div>
          <div className="grid items-center grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-10">
            <div>
              <h3 className="text-4xl text-slate-50">The IPool interface </h3>
              <p className="text-lg text-slate-400">
                {
                  'The IPool interface was developed by the Sushi team in the process of building Trident, which is a system of contracts that supports the four most canonical types of liquidity in DeFi: Classic...'
                }
              </p>
            </div>
            <Image src={boardImg} width={360} height={320} unoptimized objectFit="scale-down" alt="ipool" />
          </div>
        </section>
        <ProductCards
          name={name}
          description="BentoBox is unique token vault that generates yield (interest) on your tokens, while also allowing you to utilize them in DeFi protocols like lending markets ir liquidity pools."
          cards={cards}
          gradientBorderColor={color}
        />
        <ProductArticles
          title="Articles"
          subtitle="Read more about the latest releases"
          articles={latestArticles}
          productName={productSlug}
          isLoading={isValidating}
        />

        <ProductArticles
          title={`Learn about ${name}`}
          subtitle="Check out our tutorials and explainers"
          articles={relevantArticles}
          productName={productSlug}
          isLoading={isValidating}
        />
        <ProductTechnicalDoc color={color} secondaryColor="#FEC464" />
        <ProductFaq faq={faq} />
      </Container>
    </>
  )
}

export default ProductPage
