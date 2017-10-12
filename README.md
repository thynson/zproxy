Firefox 57+ Compatitable Proxy Switcher
=======================================

Why a new addon is made?
-----------------------

There is yet an proxy addons compatible with Firefox 57+, people like me,
as a bleeding edge Firefox user, may need a proxy swith to pass the Greate
Firewall.

How to try it?
--------------

1. Clone this repo to your disk.

2. Open `about:debugging` in Firefox, and click *Load temproary add-ons* and
   select the file named `manifest.json` in this project
3. Open setting of this plugin from `about:addons`, provide your proxy
   connection configuration.
4. Enjoy

Note that since you can only loaded it temporarary, after restarting Firefox
you need to reload this add-on. If you like it, jsut wait for its presenting
on https://addons.mozilla.org

Note
----
1. Currently only rules from GFW-List will be loaded, custom rule not yet supported
2. This plugin supports Firefox 56+.
