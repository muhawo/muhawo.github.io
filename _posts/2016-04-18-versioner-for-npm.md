---
layout: post
title: npm依赖关系中的版本号
---

* Hyphen Ranges 1.2.3 - 2.3.4
* X-Ranges 1.2.x 1.X 1.2.* *
* Tilde Ranges ~1.2.3 ~1.2 ~1
* Caret Ranges ^1.2.3 ^0.2.5 ^0.0.4


Hyphen Ranges X.Y.Z - A.B.C

Specifies an inclusive set.

    1.2.3 - 2.3.4 : >=1.2.3 <=2.3.4

If a partial version is provided as the first version in the inclusive range, then the missing pieces are replaced with zeroes.

    1.2 - 2.3.4 : >=1.2.0 <=2.3.4

If a partial version is provided as the second version in the inclusive range, then all versions that start with the supplied parts of the tuple are accepted, but nothing that would be greater than the provided tuple parts.

    1.2.3 - 2.3 := >=1.2.3 <2.4.0
    1.2.3 - 2 := >=1.2.3 <3.0.0

X-Ranges 1.2.x 1.X 1.2.* *

Any of X, x, or * may be used to "stand in" for one of the numeric values in the [major, minor, patch] tuple.

    * := >=0.0.0 (Any version satisfies)
    1.x := >=1.0.0 <2.0.0 (Matching major version)
    1.2.x := >=1.2.0 <1.3.0 (Matching major and minor versions)

A partial version range is treated as an X-Range, so the special character is in fact optional.

    "" (empty string) := * := >=0.0.0
    1 := 1.x.x := >=1.0.0 <2.0.0
    1.2 := 1.2.x := >=1.2.0 <1.3.0

Tilde Ranges ~1.2.3 ~1.2 ~1

Allows patch-level changes if a minor version is specified on the comparator. Allows minor-level changes if not.

    ~1.2.3 := >=1.2.3 <1.(2+1).0 := >=1.2.3 <1.3.0
    ~1.2 := >=1.2.0 <1.(2+1).0 := >=1.2.0 <1.3.0 (Same as 1.2.x)
    ~1 := >=1.0.0 <(1+1).0.0 := >=1.0.0 <2.0.0 (Same as 1.x)
    ~0.2.3 := >=0.2.3 <0.(2+1).0 := >=0.2.3 <0.3.0
    ~0.2 := >=0.2.0 <0.(2+1).0 := >=0.2.0 <0.3.0 (Same as 0.2.x)
    ~0 := >=0.0.0 <(0+1).0.0 := >=0.0.0 <1.0.0 (Same as 0.x)
    ~1.2.3-beta.2 := >=1.2.3-beta.2 <1.3.0 Note that prereleases in the 1.2.3 version will be allowed, if they are greater than or equal to beta.2. So, 1.2.3-beta.4 would be allowed, but 1.2.4-beta.2 would not, because it is a prerelease of a different [major, minor, patch] tuple.

Caret Ranges ^1.2.3 ^0.2.5 ^0.0.4

Allows changes that do not modify the left-most non-zero digit in the [major, minor, patch] tuple. In other words, this allows patch and minor updates for versions 1.0.0 and above, patch updates for versions 0.X >=0.1.0, and no updates for versions 0.0.X.

Many authors treat a 0.x version as if the x were the major "breaking-change" indicator.

Caret ranges are ideal when an author may make breaking changes between 0.2.4 and 0.3.0 releases, which is a common practice. However, it presumes that there will not be breaking changes between 0.2.4 and 0.2.5. It allows for changes that are presumed to be additive (but non-breaking), according to commonly observed practices.

    ^1.2.3 := >=1.2.3 <2.0.0
    ^0.2.3 := >=0.2.3 <0.3.0
    ^0.0.3 := >=0.0.3 <0.0.4
    ^1.2.3-beta.2 := >=1.2.3-beta.2 <2.0.0 Note that prereleases in the 1.2.3 version will be allowed, if they are greater than or equal to beta.2. So, 1.2.3-beta.4 would be allowed, but 1.2.4-beta.2 would not, because it is a prerelease of a different [major, minor, patch] tuple.
    ^0.0.3-beta := >=0.0.3-beta <0.0.4 Note that prereleases in the 0.0.3 version only will be allowed, if they are greater than or equal to beta. So, 0.0.3-pr.2 would be allowed.

When parsing caret ranges, a missing patch value desugars to the number 0, but will allow flexibility within that value, even if the major and minor versions are both 0.

    ^1.2.x := >=1.2.0 <2.0.0
    ^0.0.x := >=0.0.0 <0.1.0
    ^0.0 := >=0.0.0 <0.1.0

A missing minor and patch values will desugar to zero, but also allow flexibility within those values, even if the major version is zero.

    ^1.x := >=1.0.0 <2.0.0
    ^0.x := >=0.0.0 <1.0.0


原文链接[The semantic versioner for npm](https://docs.npmjs.com/misc/semver)


