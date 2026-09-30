# Pull Request Checklist

Use this checklist before opening your pull request for Task 3.1.

## Submission details
- [ ] Forked the repository
- [ ] Completed the work in the fork
- [ ] Committed the changes
- [ ] Pushed the branch to the fork
- [ ] Opened a pull request to `main`
- [ ] Added the required submission line in the PR description: `XX-XXXXX TXX`

## Review API checks
- [ ] `Review` model includes `mealCode`, `rating`, `comment`, and `reviewedBy`
- [ ] `rating` is required and limited to 1 through 5
- [ ] `timestamps: true` is enabled
- [ ] Compound unique index exists on `{ mealCode: 1, reviewedBy: 1 }`
- [ ] `createReview` returns `201` with `{ review: ... }`
- [ ] `getAllReviews` returns `200` with `{ reviews: [...] }`
- [ ] `getReview` returns `404` with `{ message: 'Review not found' }` when missing
- [ ] `getReviewSummary` uses `Review.aggregate()`
- [ ] `/summary` is defined before `/:id`
- [ ] Missing `mealCode` returns `400` with `{ message: 'mealCode is required' }`

## Verification
- [ ] Ran the server locally
- [ ] Ran the tests
- [ ] Confirmed no unrelated files were changed
