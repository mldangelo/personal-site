
# What?

Problems at Arthena are challenging because art market data is often poorly structured (requires domain-specific knowledge to extract information from natural language), transactions occur infrequently, and every work of art is unique. Arthena borrows concepts from quantitative finance and machine learning research topics like Graph Neural Networks. Over the last seven years, my company has built a comprehensive transactional database.

Most art is appraised by human experts near in time to a point of sale. Human appraisals are expensive, take time, and exhibit bias. They are generally based on a) the intuition of the appraiser, and b) the performance of similar works of art found in price databases like [Artnet](https://www.artnet.com/price-database/). With automated valuation models, the values of millions of works of art can be recomputed daily with strict uncertainty bounds.

Tools are used in a variety of different business contexts.

Arthena’s feature engineering tasks often have ambiguous solutions and require thorough research and nuanced understanding of art lexicon and the semantic structure of language.

# Why?

...

# How? General Technology Description

Crawl the internet aggregating everything about the artists we care about and their known works. Sources include encyclopedias, museums, and transactional data.
Maintain meta-information about what events are happening. Use this information to plan an update strategy.
Detect changes and propagate events forward through the real-time streaming system.
Structure and normalize data (including images), link entities, filter superfluous data.
Support aliases and foreign languages.
Gain confidence in data by combining evidence from many sources.
Support overriding corrections made by the team.
Construct point in time feature embeddings over data.
Features are probabilistic (ex. 88% probability structure is bronze, 7% brass, ...).
Train supervised graph embeddings.
Perform nearest neighbor search over graph embedding to find the closest comps.
Construct a hedonic model to compensate for external market factors.
Use bayesian models to bound price ranges based on comps.
Serve information to users in a view optimized for the business context.
Enable experts to adjust information (ex: decide a particular work is not a true comp), supplying them with updated predictions in real-time.
