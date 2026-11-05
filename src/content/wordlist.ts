/**
 * Friendly, school-appropriate words for the passphrase generator.
 * Words are picked with crypto.getRandomValues, so each word adds log2(list size) bits of entropy.
 */
const RAW = `
acorn actor adobe agent alarm album alley amber anchor angle ankle apple apron arcade arch arena armor arrow artist aspen atlas attic autumn avocado award axle
bacon badge bagel baker bamboo banana banjo barn barrel basil basket beach beacon beagle beam bean bear beaver bed beetle bell bench berry bike bingo birch biscuit bison blanket blender blizzard bloom blossom blueberry board boat bonfire bongo book boot bottle boulder bowl box bracelet branch bread breeze brick bridge broccoli brook broom bubble bucket buffalo bugle bundle bunny burrito butter button
cabin cactus cake camel camera camp candle canoe canyon cape captain caramel card cargo carpet carrot castle cat cave cedar celery cello cereal chair chalk channel cheddar cherry chess chili chimney chip chorus cider cinema circle circus citrus clam clarinet claw clay cliff clock cloud clover coast cobalt cocoa coconut comet compass cookie coral cotton cougar cowboy coyote crab crane crayon creek cricket crown crumb crystal cupcake curtain cushion cymbal
daisy dancer dawn deer delta denim desert desk dew diamond dinner dino dipper dock dolphin domino donut dove dragon drawer dream drum duck dune dust
eagle easel echo eclipse eel elbow elephant elk elm ember emerald engine envelope eraser escape evening
fabric falcon fan farm feather fern ferry fiddle field fig finch fire fjord flag flame flamingo flannel flute foam fog folder forest fork fossil fountain fox frame freckle frog frost fudge
galaxy garden garlic gazelle gecko gem geyser ginger giraffe glacier glider globe glove goat goose gopher gorilla grape gravel guitar gull gumbo
habit hammer hammock harbor harp hatch hawk hazel heart hedge helmet heron hiker hill hippo hobby honey hoodie hook horizon horse hotel hummus husky
iceberg igloo iguana index ink island ivory ivy
jacket jaguar jam jar jasmine jazz jeans jelly jester jet jewel jigsaw jogger journal juice jungle juniper
kayak kazoo kelp kettle key kiwi kite kitten knight knot koala
label ladder ladle lagoon lake lamp lantern laptop lark lasso lava lawn leaf lemon lentil lettuce library lilac lily lime lion lizard llama lobster locket lodge lotus lunar lynx
magnet magpie mango map maple marble market marsh mask meadow melon meteor mint mirror mitten mocha modem monkey moon moose mosaic moss motor mountain muffin mural mushroom music
nacho napkin narwhal nebula nectar needle nest nickel night noodle north notebook nugget nutmeg
oak oasis oatmeal ocean octopus olive omelet onion opal orange orbit orchard orchid otter oven owl oyster
paddle pagoda paint palm pancake panda paper parade parrot pasta peach peanut pear pebble pelican pencil penguin pepper piano pickle picnic pillow pilot pine pinwheel pirate pizza planet plum pocket poem polar pond popcorn poppy portal potato pretzel prism puffin pumpkin puppet puzzle pyramid
quail quartz quest quill quilt quiver
rabbit raccoon radar radio radish raft rain raisin ramen ranch raven recipe reef rhino ribbon river robin robot rocket rodeo roof rose rover ruby ruler
saddle saffron sail salad salmon salsa sandal satchel saturn scarf school scooter sea seal seed shadow shark shell sherbet ship shovel shrimp signal silver skate sketch sky sled slipper sloth snail snow soccer sock sofa solar sonnet soup spark sparrow spider spinach sponge spoon spruce squash squid stable star statue steam stone storm strawberry stream sugar summit sun sunset swan sweater syrup
table taco tadpole tango teapot telescope temple tent thunder tiger timber toast toffee tomato topaz torch tortoise tower tractor trail train trumpet tulip tundra turkey turnip turtle tuxedo twig
ukulele umbrella unicorn universe urchin
valley vanilla vapor velvet vessel violet violin volcano voyage vulture
waffle wagon walnut walrus wand wave weasel whale wheat whistle willow window winter wizard wolf wombat
yacht yak yarn yodel yogurt yonder
zebra zephyr zigzag zinnia zipper zucchini
`;

export const WORDS: string[] = [...new Set(RAW.trim().split(/\s+/))];
