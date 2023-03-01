# MiningVis-data-visualization-D3js
We created a visual analytics tool to aid in the invesitigation of the history and statistics of the Bitcoin mining business.

# Project - MiningVis
Project Repository - MiningVis

• V1: Time Selection view
– Visual Encoding: It is a time series chart, a filter for the visualizations, and an overview of the
mining statistics.
– Interaction: It filters the visualizations (V2–V6) to a specific time interval by specifying a range
with the calendar inputs.

• V2: Mining distribution view
– Visual Encoding: This is a ribbon chart that allows detection of dominating mining pools,
the rise and decline of mining pools, and finding characteristics that possibly lead to changes in
ranking.
– Interaction: Besides the measures, group-by, and color-by selectors, V2 provides two ways to
highlight mining pools or their characteristics viz. clicking on the left side labels and drawing a
brush on the ribbon chart .

• V3: Mining pool details view
– Visual Encoding: We use a temporal bar chart to encode aggregated (per month) mining pool
measures.
– Interaction: It is controlled by selections made in V2 as they are meant as accompanying detail.
Analysts can click the info icon for a text description of the pool’s characteristics. Additional
interactions are tooltips for detail-in-demand.

• V4: Bitcoin statistics view
– Visual Encoding: Encodes 17 different factors each as a gray temporal area chart.
– Interaction: The view offers details-on-demand via a tooltip.

• V5: Bitcoin news view
– Visual Encoding: We use a swarm plot to display each individual news item in a compact
fashion across a timeline.
– Interaction: Browse the news by hovering circles, using keyword search, and sliding to specify
the number of news showing in the chart.

• V6: Cross pooling view
– Visual Encoding: We used a chord diagram to display a metric related to miners crossing between
pools; the total amount of miners’ rewards (default) or the total number of miner addresses.
– Interaction: Analysts can hover over the flow or stacked bars to see the exact value.

