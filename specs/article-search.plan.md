# Article Search Test Plan

## Application Overview

The QA Dojo "Testing articles" home page (`/articles`, Playwright project `articles-creating`, baseURL `http://104.168.59.50/articles`, `testIdAttribute: data-testid`) shows a "Global feed" of 9 seeded articles. A toolbar offers a headline search box, a sort select (Newest first / Oldest first / Most favorited), a "With cover" checkbox, and Reset / Apply buttons. A "Popular tags" sidebar and a count label ("9 articles") are also present. The page is a client-rendered SPA: right after `goto` the body shows only "Завантаження модуля…", so tests must wait for the toolbar.

Observed test ids: `home-search-input`, `home-sort`, `home-filter-cover`, `home-filter-apply`, `home-filter-reset`, `feed-article-count`, `feed-toolbar`, `article-list`, `feed-tab-global`.

Observed behaviour: search matches article headlines only, case-insensitive, substring, Cyrillic works. Article-level tag words (e.g. "selectors" as a tag, not in the headline) did not match. URL does not change when searching.

**Deviation from skill:** no seed test exists and the user asked not to create one. Exploration was done by opening `http://104.168.59.50/articles` directly with `playwright-cli open`, not via `--debug=cli`. Scenarios therefore use `**Seed:** none` and start with a plain `page.goto('/articles')` (fresh state). Search is not persisted across reload (see 1.8).

## Test Scenarios

### 1. Article search

**Seed:** none (navigate to `/articles` and wait for `home-search-input` to be visible)

#### 1.1. should-filter-by-headline-with-apply

**File:** `tests/articles-creating/should-filter-by-headline-with-apply.spec.ts`

**Steps:**
  1. Open `/articles`. Confirm `feed-article-count` shows "9 articles".
    - expect: `article-list` contains 9 articles
  2. Type "CI" into `home-search-input`, click `home-filter-apply`.
    - expect: `feed-article-count` shows "1 article"
    - expect: the single visible article heading is "Швидкий CI: що ми змінили за один спринт"
    - expect: URL stays `/articles`

#### 1.2. should-search-case-insensitively-and-ignore-surrounding-spaces

**File:** `tests/articles-creating/should-search-case-insensitively-and-ignore-surrounding-spaces.spec.ts`

**Steps:**
  1. Type "  PAGE object " (leading/trailing spaces, mixed case) into `home-search-input`, click Apply.
    - expect: count shows "1 article"
    - expect: heading "Page Object без надмірної абстракції" is visible

#### 1.3. should-match-cyrillic-substring

**File:** `tests/articles-creating/should-match-cyrillic-substring.spec.ts`

**Steps:**
  1. Type "тест" into `home-search-input`, click Apply.
    - expect: count shows "4 articles"
    - expect: headings shown (default Newest first): "Як писати стабільні селектори для UI-тестів", "Ізоляція тестових даних у паралельному запуску", "Page Object без надмірної абстракції", "П’ять питань перед тестуванням нової форми"

#### 1.4. should-show-empty-state-for-no-match

**File:** `tests/articles-creating/should-show-empty-state-for-no-match.spec.ts`

**Steps:**
  1. Type "zzzxx" into `home-search-input`, press Enter (Enter applies the search).
    - expect: count shows "0 articles"
    - expect: text "No articles here yet." is visible
    - expect: no `article` elements
  2. Repeat on a fresh page with input "<b>" and Apply.
    - expect: count shows "0 articles", page does not break or render HTML

#### 1.5. should-reset-search

**File:** `tests/articles-creating/should-reset-search.spec.ts`

**Steps:**
  1. Search for "zzzxx" and confirm "0 articles".
  2. Click `home-filter-reset`.
    - expect: `home-search-input` is empty
    - expect: count shows "9 articles" and 9 articles are listed

#### 1.6. should-combine-search-with-sort-and-cover-filter

**File:** `tests/articles-creating/should-combine-search-with-sort-and-cover-filter.spec.ts`

**Steps:**
  1. Type "тест", choose "Oldest first" in `home-sort`, click Apply.
    - expect: order is reversed: "П’ять питань перед тестуванням нової форми", "Page Object без надмірної абстракції", "Ізоляція тестових даних у паралельному запуску", "Як писати стабільні селектори для UI-тестів"
  2. Check `home-filter-cover`, click Apply.
    - expect: count shows "2 articles"
    - expect: remaining headings (Oldest-first order not re-checked; observed with Newest first): "Як писати стабільні селектори для UI-тестів", "Ізоляція тестових даних у паралельному запуску"

#### 1.7. should-not-match-tag-only-terms

**File:** `tests/articles-creating/should-not-match-tag-only-terms.spec.ts`

**Steps:**
  1. Type "selectors" (a tag of the first article but not in any headline) and click Apply.
    - expect: count shows "0 articles" (observed: search covers headlines only)

#### 1.8. should-reset-search-after-reload

**File:** `tests/articles-creating/should-reset-search-after-reload.spec.ts`

**Steps:**
  1. Type "тест" into `home-search-input`, click Apply.
    - expect: input value "тест", 4 articles listed
  2. Reload the page and wait for `home-search-input` to be visible.
    - expect: input is empty
    - expect: 9 articles listed (observed; URL stays `/articles`, sessionStorage empty, localStorage has 1 unrelated key)

## Not verified

- Whether the list updates live while typing was not isolated; Enter and Apply both applied the filter.
