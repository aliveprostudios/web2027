---
title: "Spreadsheets, Integration, One Source of Truth"
url: "/common-questions/data-and-dashboards"
order: 3
caption: "When a spreadsheet stops being enough, and what replaces it."
seoTitle: "Spreadsheets, Integration and One Source of Truth"
seoDescription: "When to replace spreadsheets with a real system, how to connect software that was never built to work together, and what belongs on an executive dashboard."
quote: "Every company we meet has numbers. Very few have numbers everyone in the room agrees on. That agreement is the actual project."
questions:
  - anchor: replace-spreadsheets
    services:
      - /infrastructure/solution-architecture-design
      - /infrastructure/custom-app-development
    related:
      - /common-questions/custom-software#small-business-custom-software
      - /common-questions/manufacturing#quoting-spreadsheets
  - anchor: connect-systems
    services:
      - /infrastructure/intelligent-systems-integration
    related:
      - /common-questions/custom-software#build-or-buy
      - /common-questions/data-and-dashboards#executive-dashboard
  - anchor: executive-dashboard
    services:
      - /infrastructure/dashboards-analytics
    related:
      - /common-questions/data-and-dashboards#connect-systems
      - /common-questions/marketing-and-leads#marketing-budget
---

Most companies do not have a data problem. They have the same data in four places, in four states, and no agreement about which one is right. That is a different problem and it has a different fix.

## When should a company replace spreadsheets with a real system?

When more than one person needs the same spreadsheet at the same time, when a mistake inside it would be expensive and invisible, or when someone spends real hours each week keeping copies in agreement. A spreadsheet used by one person for one purpose is still the right tool and does not need replacing.

Spreadsheets get replaced too early as often as too late. They are fast, flexible, and everyone already knows how to use them, which is why they quietly become the operating system of most small companies.

The failure is not the spreadsheet. It is the moment it stops being a document and starts being a database several people depend on. Three symptoms mark that line. Versions multiply, and the question of which one is current has to be asked out loud. Data gets re-keyed from the spreadsheet into another system, or the other way round. And one person becomes the only one who understands the formulas, which turns an ordinary holiday into a business risk.

Cost is the test that settles it. Add up the hours spent reconciling, the errors that reached a customer, and the decisions delayed because nobody trusted the numbers. Compare that with what replacing it would cost. Often the answer is that the spreadsheet is fine and the process around it needs tightening.

When replacement is right, the target is not automatically custom software. A shared database, a properly configured platform, or in some cases a better-built spreadsheet with real controls will do. The point is one place where the number lives, not the technology used to get there.

## How do you connect software that was never built to work together?

Through their interfaces where they have them, and through a middle layer where they do not. Most business software offers an API, and a small integration service can read from one system, translate, and write to another. Where a system is genuinely closed, scheduled file exchange still works and is often enough.

Companies rarely choose their software. They accumulate it, one decision at a time, each sensible on its own. The result is an accounting system from one era, a CRM from another, and a production system chosen because it was the only one that understood the industry. None of them were designed with the others in mind.

Connecting them starts with a question about direction, not technology. For every piece of information that lives in two places, which system is the authority? Whose customer record wins when they disagree? Answering that for a dozen fields is most of the work, and it is a business decision rather than a technical one.

Once direction is settled, the mechanics are usually straightforward. Modern systems expose APIs. Older ones export files on a schedule. A small integration layer sits between them, translating formats and handling the cases where one system requires a field the other does not hold.

The trap is point-to-point connections. Six systems wired directly to each other means fifteen connections to maintain, and every change to one breaks several others. Routing through a middle layer means six connections and one place to fix them. It looks like more work at the start and it is dramatically less work by the third integration.

## What is an executive dashboard, and what belongs on one?

An executive dashboard is a single screen showing the small number of measures that tell you whether the business is on course. It is not a report and it is not an analytics tool. If it takes more than a glance to read, or if nobody would act differently based on what it shows, it is not doing its job.

Most dashboards fail by being generous. Everything measurable gets added, the screen fills, and within a month nobody opens it. A dashboard earns attention by leaving things out.

A measure belongs on one when it passes a simple test: if this number moved sharply, would someone change what they are doing this week? Revenue passes. Website sessions usually do not.

In practice the useful measures cluster into four kinds:

- What is coming in. Pipeline, quotes out, enquiries by source.
- What is going out. Orders shipped, jobs completed, capacity used.
- What it is worth. Margin rather than revenue alone, because revenue by itself hides the problem.
- What is at risk. Overdue work, aged receivables, customers who have gone quiet.

Six to ten numbers is a working range. Beyond that it becomes a report, and reports are read on a schedule rather than at a glance.

The other half of a dashboard's value is trust. A number nobody believes is worse than no number, because it starts an argument about the data instead of a conversation about the business. That is why dashboards are usually the last thing built rather than the first. They are only ever as good as the systems feeding them.
