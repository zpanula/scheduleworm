## Pull Request template

Please, go through these steps before you submit a PR.

1. Your pull request **must** be tied to an issue.
2. Make sure that your PR is not a duplicate.
3. If not, then make sure that:

   a. You have done your changes in a separate branch. Branches MUST have descriptive names that reference an open issue. Good examples are: `SW12-signin_issue` or `SW18-issue_templates`.

   b. You have a descriptive commit message with a short title (first line).

   c. You have only one commit (if not, squash them into one commit).

   d. `npm test` doesn't throw any error. If it does, fix them first and amend your commit (`git commit --amend`).

4. **After** these steps, you're ready to open a pull request.

   a. Give a descriptive title to your PR.

   b. Provide a description of your changes.

   c. Put `Resolves #XXXX` in your comment to auto-close the issue that your PR resolves.

**PLEASE REMOVE THIS TEMPLATE BEFORE SUBMITTING**
