import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-09-15"
      title="Publishing First IEEE Paper: From Research to Publication"
      summary="Our energy harvesting paper was accepted to IEEE! The journey from research to publication is long and humbling. Peer review is brutal but necessary."
      content={`Just received the email: "We are pleased to inform you that your paper has been accepted for publication in IEEE Transactions on Circuits and Systems." First journal publication! The journey from lab bench to prestigious journal was longer and harder than expected.

## The Paper

Title: "A Multi-Source Ambient Energy Harvesting System with Adaptive Source Combining for Wireless Sensor Nodes"

Eight pages of dense technical content representing 18 months of work.

## The Research Journey

### Initial Failure (Months 1-6)
- Single source harvesting
- Never exceeded 500 μW
- Advisor disappointed
- Confidence shaken

### Breakthrough (Month 7)
- Idea during bike ride
- Multiple sources combined
- Adaptive algorithm
- Finally hit 1 mW!

### Verification (Months 8-12)
- Extensive testing
- Statistical validation
- Real-world deployment
- Reproducible results

## Writing Process

### First Draft
Two weeks of writing:
- 15 pages (too long)
- 127 references (too many)
- Passive voice everywhere
- Imposter syndrome maximum

### Advisor Feedback
Red ink massacre:
- "Unclear"
- "Why?"
- "Evidence?"
- "Rewrite entirely"

Brutal but necessary.

### Revisions
Version history:
- v1_initial.tex
- v2_after_advisor.tex
- v3_clarity.tex
- ...
- v47_final_maybe.tex
- v48_final_FINAL.tex
- v49_final_FINAL_v2.tex

## IEEE Submission

### Formatting Hell
IEEE requirements:
- Specific LaTeX template
- Exact column width
- Figure placement rules
- Reference format precise

Three days just formatting.

### The Submission
February 15, 11:58 PM:
- PDF generated
- Figures checked
- Abstract perfected
- Submit clicked
- Immediately found typo

## Peer Review Process

### The Wait
- Submitted: February
- Under review: March
- Still under review: April
- Still under review: May
- Anxiety: Increasing

### First Reviews (June)
Three reviewers:

**Reviewer 1**: Positive
"Novel approach to multi-source harvesting. Well-written. Minor revisions needed."

**Reviewer 2**: Critical
"Insufficient comparison with prior work. Mathematical derivation unclear. Major revisions required."

**Reviewer 3**: Harsh
"Contribution unclear. Why not use batteries? Experimental setup questionable."

Emotional rollercoaster.

## Major Revision

### Addressing Concerns
Two months of:
- Additional experiments
- Mathematical proofs
- 20 more references
- Complete rewrite of sections

### Response Letter
10 pages addressing every comment:
"We thank the reviewer for this insightful comment. We have addressed this by..."

Diplomatic writing at its finest.

### Resubmission
New version:
- 30% longer
- Clearer contributions
- More rigorous proofs
- Better comparisons

## Second Review Round

### The Verdict (September)
**Reviewer 1**: "Much improved. Accept."

**Reviewer 2**: "Authors addressed my concerns. Accept with minor revisions."

**Reviewer 3**: "Better but still skeptical. However, work is technically sound. Accept."

ACCEPTED!

## Final Preparations

### Copy Editing
IEEE's copy editor found:
- Inconsistent units
- Reference errors
- Grammar issues
- Figure quality problems

Another week of fixes.

### Proofs
Final PDF proof:
- Name spelled correctly ✓
- Affiliation correct ✓
- Figures look good ✓
- Equations formatted ✓

Signed off with trembling hands.

## Publication Day

October issue live:
- Downloaded PDF
- Sent to parents
- Posted on website
- Shared with lab
- Frame-worthy moment

## Impact Tracking

First month:
- Downloads: 127
- Citations: 0 (too early)
- Emails: 3 (questions)
- Implementation requests: 2

Small but meaningful start.

## Lessons Learned

### About Research
1. **Persistence essential** - First ideas usually fail
2. **Document everything** - You'll forget
3. **Reproducibility crucial** - Others must verify
4. **Collaboration helps** - Fresh perspectives

### About Writing
1. **Start early** - Writing takes forever
2. **Accept criticism** - Reviewers improve paper
3. **Clear > clever** - Communicate simply
4. **Figures matter** - Worth 1000 words

### About Academia
1. **Peer review works** - But it's brutal
2. **Patience required** - Everything takes months
3. **Networking matters** - Know your field
4. **Celebrate wins** - They're rare

## The Real Impact

Beyond the publication:
- Confidence boost
- Advisor impressed
- CV enhanced
- Skills developed
- Network expanded

## Advice for First-Timers

1. **Pick right venue** - Match paper to journal
2. **Read that journal** - Understand expectations
3. **Get feedback early** - Before submission
4. **Prepare for rejection** - It's normal
5. **Persist** - Revision not rejection

## The Bigger Picture

This paper represents:
- Countless failed experiments
- Late nights debugging
- Mathematical struggles
- Writing and rewriting
- Growth as researcher

One line on CV. Months of life.

## Future Papers

Already planning next:
- Conference paper (faster)
- Journal extension
- New research direction
- Collaboration opportunities

First paper hardest. Gets easier?

## Celebration

How we celebrated:
- Lab dinner (advisor paid!)
- Nice wine bottle
- Framed first page
- Called home
- Slept well finally

## Final Reflection

Publishing in IEEE Transactions:
- Dream achieved ✓
- Imposter syndrome reduced
- Research validated
- Career advanced
- Next goal set

The email notification will forever be starred.

From "just a student" to "published researcher."

That's Dr. Student to you (eventually).

📚🎓📰`}
      tags={["publication","ieee","research","academic-writing"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Publishing First IEEE Paper: From Research to Publication - Michael D'Angelo",
    description: "Our energy harvesting paper was accepted to IEEE! The journey from research to publication is long and humbling. Peer review is brutal but necessary.",
  };
}