autoscale: true

# Leveling up as a ~~trainer~~ developer
### Libraries I wish I knew when I started.

![fit right](http://pre08.deviantart.net/0dc3/th/pre/f/2014/218/7/3/ash_ketchum___01_by_mighty355-d7tynve.png)

^
less time on fragment in butter Knife
build narative for presentation
better transition to new library
too fast in realm
too many umms

---

# Chris Guzman
## Engineer - Groupon

######  @speaktochris | chguzman@groupon.com | http://bit.do/christalk

###### Not an actual Pokemon trainer.

---

#[fit] I made a lot of mistakes when I switched to Android

#### But you don't have to!

---

# A lot of apps do similar things

- Load and display images
- Update views based on data from API
- Fetch data from an API
- Parse JSON
- Persist data to storage

---

# These libraries prevent you **reinventing the wheel** with every project.

- [Picasso](https://github.com/square/picasso) v2.5
- [Butter Knife](https://github.com/JakeWharton/butterknife) v8.2
- [Gson](https://github.com/google/gson) v2.7
- [Retrofit](https://github.com/square/retrofit) v2.1
- [Realm](https://realm.io/docs/java/latest/) v1.1
- [Dart & Henson](https://github.com/f2prateek/dart) v2.0

^
Write less code
Be more productive

---

# **Picasso**

![right fit](http://cdn.shopify.com/s/files/1/0263/4245/products/pikasso.jpg?v=1382482059)

---

# Download and display images with ease!

Benefits:

- makes HTTP Requests
- caches the images
- easy resizing/cropping/centering/scaling
- takes care of downloading off the main thread
- properly recycles views in RecyclerView

---

# Pop quiz

## Which do you prefer?

---

```java
private Bitmap DownloadImage(String url)
{
    Bitmap bitmap = null;
    InputStream in = null;

    try
    {
        in = OpenHttpGETConnection(url);
        bitmap = BitmapFactory.decodeStream(in); in.close();
    }
    catch (Exception e)
    {
        Log.d("DownloadImage", e.getLocalizedMessage());
    }

    return bitmap;
}
```
---

![fit](http://img08.deviantart.net/9261/i/2013/238/f/d/no_grumpy_cat_by_nemesis_panda-d6jt4gj.jpg)

---

# Or...
```java
Picasso.with(context)
        .load("http://placekitten.com/200/300")
        .into(imageView);
```

---
![fit](http://placekitten.com/g/800/1200)

---

# But wait there's more!
```java
.placeholder(R.mipmap.ic_launcher) //can be a resource or a drawable
.error(R.drawable.ic_error_fallback) //fallback image if error
.fit() //reduce the image size to the dimensions of imageView
.resize(imgWidth, imgHeight) //resizes the image in pixels
.centerCrop() //or .centerInside()
.rotate(90f) //or rotate(degrees, pivotX, pivotY)
.noFade() //don't fade all fancy-like
```

^
 `centerCrop` cuts out the excess
`centerInside` may show blank space
`fit()` can delay the image request since Picasso will wait to measure the ImageView
`resize()` and `fit()` reduce memory size
`.rotate` auto rotates from center, but can use 3 args to rotate from diff spot
https://futurestud.io/blog/picasso-image-resizing-scaling-and-fit


---

# Not just for loading images from the web

```java
Picasso.with(context).load(R.drawable.pokeball).into(imageView1);
Picasso.with(context).load("file:///asset/pokeball.png").into(imageView2);
Picasso.with(context).load(new File(...)).into(imageView3);
```

---

# **Butter Knife**
### Use annotations to write less boilerplate code

- How many times have you wrote findViewById?
- No additional cost at run-time - does not slow down your app at all!
- Improved View lookups
- Improved Listener attachments
- Improved Resource lookups


---

# Bind views in an activity

```xml
<TextView android:id="@+id/title"
    ...
    />

```

```java
public class MainActivity extends Activity {
    @BindView(R.id.title) TextView title;

    @Override
    protected void onCreate(Bundle bundle) {
        ...
        ButterKnife.bind(this);
        title.setText("Hello from Butterknife");
    }
}
```

---

![fit](http://66.media.tumblr.com/tumblr_lkgv74l7u11qjae8bo1_500.gif)

---

# `ButterKnife.bind(this)`

Generates code that looks up views/resources and saves them as a property on the Activity.

```java
public void bind(MainActivity activity) {
  activity.title = (android.widget.TextView) activity.findViewById(2130968577);
}
```
---

#### Bind and unbind views in a fragment

```java
public class MyFragment extends Fragment {
  @BindView(R.id.name) EditText firstName;

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup group, Bundle bundle) {
    ...
    ButterKnife.bind(this, parentView);
    //Important!
    unbinder = ButterKnife.bind(this, parentView);
    firstName.setHint("Joe Schmoe")
    return view;
  }

  @Override
  public void onDestroyView() {
    super.onDestroyView();
    //sets the views to null
    unbinder.unbind();
  }
}
```

^
 Because fragments have a different view lifecycle than activities, set the views to null in onDestroyView.
Butter Knife returns an Unbinder instance when you call bind to do this for you.
This prevents memory leaks:
GC won't collect bonded views if there is strong reference to the fragment (async code still running).
By unbinding we let GC release the fragment and the views
https://github.com/JakeWharton/butterknife/issues/291

---

# Event listeners

```java
@OnClick(R.id.submit)
public void sayHi(Button button) {
  button.setText("Hello!");
}
```

### Arguments to the listener method are optional

```java
@OnClick(R.id.submit)
public void sayHi() {
  Log.d("SubmitBtn", "onClick")
}
```

---

Butter Knife also supports:
- `OnLongClick`
- `OnEditorAction`
- `OnFocusChange`
- `OnItemClick`
- `OnItemLongClick`
- `OnItemSelected`
- `OnPageChange`
- `OnTextChanged`
- `OnTouch`
- `OnCheckedChanged`

---

# Inject resources once, no need to save them as member variables!

```java
class MainActivity extends Activity {
  @BindString(R.string.title) String title;
  @BindDrawable(R.drawable.graphic) Drawable graphic;
  // int or ColorStateList
  @BindColor(R.color.red) int red;
  // int (in pixels) or float (for exact value)
  @BindDimen(R.dimen.spacer) Float spacer;
}
```

---

# Group views together:

```java
@OnClick({ R.id.bulbasaur, R.id.charmander, R.id.squirtle })
public void pickStarterPkmn(View pkmn) {
  if (pkm.getId() == R.id.squirtle) {
    Toast.makeText(this, "You chose the best one!", LENGTH_SHORT).show();
  } else {
    Toast.makeText(this, "Try again", LENGTH_SHORT).show();
  }
}
```

---

# Act on list of views at once with `ButterKnife.apply`.

```java
@BindViews({R.id.street_address, R.id.city, R.id.state, R.id.zip_code})
List<EditText> addressViews;

ButterKnife.apply(addressViews, View.ALPHA, 0.0f);
```

---

## Action and Setter interfaces allow specifying simple behavior.

```java
ButterKnife.apply(addressViews, DISABLE);
ButterKnife.apply(addressViews, ENABLED, false);
```

```java
static final ButterKnife.Action<View> DISABLE = new ButterKnife.Action<View>() {
  @Override public void apply(View view, int index) {
    view.setEnabled(false);
  }
};
static final ButterKnife.Setter<View, Boolean> ENABLED = new ButterKnife.Setter<View, Boolean>() {
  @Override public void set(View view, Boolean value, int index) {
    view.setEnabled(value);
  }
};
```

^
Batch operations on views


---

# **Gson**
## To be honest, sounds like a pokemon

---

# Convert JSON to a java object and vice versa!

- Without requiring you place Java annotations in your classes
- Super performant
- Commonly used


^
 Fun fact not actively maintained by google anymore. The beauty of open source!
 Does not require that you place Java annotations in your classes
 GSON performance? How is it so performant?
 Why is GSON better than other libraries/rolling your won
 How does it work without annotation - by reflection remember that

---

# Example time!

```java
class Pokemon {
  private long pokeId = 23;
  private String name = "Ekans";
  //not included in JSON serialization or deserialization
  private transient String nickname = "Ekanescence";
  Pokemon() {}
}

// Serialize to transfer to Bill's PC
Pokemon pkmn = new Pokemon();
Gson gson = new Gson();
String json = gson.toJson(pkmn);

// ==> json is {"pokeId":23,"name":"Ekans"}

// Deserialize to transfer to your PC
Pokemon snakeMeUp = gson.fromJson(json, Pokemon.class);
// ==> snakeMeUp is just like pkmn
```

---

![fit](http://i.imgur.com/udSqNiU.jpg)


---

# Benefits

- All fields in the current class (and from all super classes) are included by default
- Supports multi-dimensional arrays

---

# Gotchas
- While serializing, a null field is skipped from the output
- While deserializing, a missing entry in JSON results in setting the corresponding field in the object to null

---

# Cool customization

```java
//Set properties to `null` instead of ignoring them
Gson gson = new GsonBuilder().serializeNulls().create();
```


```java
//Keep whitespace
Gson gson = new GsonBuilder().setPrettyPrinting().create();
```

---

## Need to rename a variable from an API?

```java
public class PokemonResponse {

    @SerializedName("pokimanz")
    List<Pokemon> pokemon;

}
```

---

## Or use a custom date format?

```java
public String DATE_FORMAT = "yyyy-MM-dd";

GsonBuilder gsonBuilder = new GsonBuilder();
gsonBuilder.setDateFormat(DATE_FORMAT);
Gson gson = gsonBuilder.create();
```

---

# Retrofit

## Stop using AsyncTask

### Please, just stop.

---

# The better way

- Typesafe
- Built in support for:
  - Authentication
  - parse JSON to POJOs
- Supports RxJava (the other new hotness)
- Can be executed synchronously or asynchronously

---

# API Endpoints

```java
public interface PokeApi {
    // Request method and URL specified in the annotation
    // Callback for the parsed response is the last parameter

    @GET("pokemon/")
    Call<List<Pokemon>> allPokemon();

    @GET("type/{type}/")
    Call<List<Pokemon>> getPokemonByType(@Path("type") String type, @Query("page") int page);

    @POST("trainers/new")
    Call<Trainer> createTrainer(@Body Trainer trainer);
}
```

---


#Getting JSON synchronously

```java

Retrofit retrofit = new Retrofit.Builder()
    //remember trailing slash
    .baseUrl("http://pokeapi.co/api/v2/")
    .addConverterFactory(GsonConverterFactory.create())
    .build();

// Create an instance of our PokeApi interface.
PokeApi pokeApi = retrofit.create(PokeApi.class);

// Create a call instance for looking up flying pokemon.
Call<List<Pokemon>> call = pokeApi.getPokemonByType("Flying", 2);

// Fetch and print a list of flying pokemon.
// Do this off the main thread
List<Pokemon> pokemon = call.execute().body();
for (Pokemon pkmn : pokemon) {
  Log.d("Pokemon", pkmn.name);
}
```

---

# POSTing JSON Async

```java
Trainer trainer = new Trainer(123, "Ash Ketchum");
Call<Trainer> call = pokeApi.createTrainer(trainer);
call.enqueue(new Callback<Trainer>() {
  @Override
  public void onResponse(Call<Trainer> call, Response<Trainer> response) {

  }

  @Override
  public void onFailure(Call<Trainer> call, Throwable t) {

  }

//JSON posted ==> {"name":"Ash Ketchum","id":123}
```

---

# Annotations

- `@Path`: variable substitution for the API endpoint.
- `@Query`: Add a query parameter.
- `@Body`: Payload for the POST call (serialized from a Java object to a JSON string)
- `@Header`: Add a header to the HTTP call

---

# Cool tricks

```java
//Change the base url
@POST("http://pokeapi.co/api/v1/trainer")
private Call<Trainer>postToOldAPI();
```

```java
//Add headers
@Headers({"User-Agent: Prof-Oak"})
@GET("/items")
private List<Items> getItemsAsProfOak()
```

---

# Realm

Replacement for sqlite


- Works by extending your models
- Made for mobile
- Most queries in Realm are fast enough to be run synchronously
- Can have multiple realm database in an app

---

# New Game Start


```java
public class Pokemon extends RealmObject {
  private String name;
  private String type;
  //getters and setters
}
```

```java
public class Trainer extends RealmObject {
  @PrimaryKey
  private long id;
  private long battlesWon;
  // Can link RealmObjects
  private RealmList<Pokemon> pokemon;
}
```

^
Primary key can be String or byte, short, int, long


---

# Typical SQL relationships

- One to One
- One to Many
- Many to One
- Many to Many

---

![inline 60%](http://i.imgur.com/tCgruVX.png)

```java
Pokemon magikarp = new Pokemon;
magikarp.setType("Water")
magikarp.getId();
```

---

# Set-up Realm

```java
// Create a RealmConfiguration
// saves the Realm file in the app's "files" directory.
RealmConfiguration realmConfig =
  new RealmConfiguration.Builder(context).build();
Realm.setDefaultConfiguration(realmConfig);

// Get a Realm instance for this thread
Realm realm = Realm.getDefaultInstance();
```

---
# Gotta persist them all

```java
// Persist your data in a transaction
realm.beginTransaction();

// Persist unmanaged objects
final Pokemon managedMagikarp = realm.copyToRealm(magikarp);

// Create managed objects directly
Pokemon pikachu = realm.createObject(Pokemon.class);

realm.commitTransaction();
```

^
Bad to do on main thread?

---


# Accessing Data
```java
final RealmResults<Pokemon> firePkmn =
 realm.where(Pokemon.class).equalTo("type", "Fire").findAll();
 firePkmn.size();
 // => 0 because there are no fire pokemon added yet

final RealmResults<Pokemon> waterPkmn =
 realm.where(Pokemon.class).equalTo("type", "Water").findAll();
 waterPkmn.size();
  // => 1
```

---

# Conditions

- `between()`
- `greaterThan()`, `lessThan()`
- `greaterThanOrEqualTo()` & `lessThanOrEqualTo()`
- `equalTo()` & `notEqualTo()`
- `contains()`

---

#Moar Conditions

- `beginsWith()` & `endsWith()`
- `isNull()` & `isNotNull()`
- `isEmpty()` & `isNotEmpty()`
- `or()` & `not()`

---

# Delete results

```java
// All changes to data must happen in a transaction
realm.executeTransaction(new Realm.Transaction() {
    @Override
    public void execute(Realm realm) {
        // remove single match
        waterPkmn.deleteFirstFromRealm();
        //or waterPkmn.deleteLastFromRealm();

        // remove a single object
        Pokemon squirtle = waterPkmn.get(1);
        squirtle.deleteFromRealm();

        // Delete all matches
        firePkmn.deleteAllFromRealm();
    }
});
```


---

# Sorting

```java
RealmResults<Pokemon> result = realm.where(Pokemon.class).findAll();
result = result.sort("level"); // Sort ascending
result = result.sort("level", Sort.DESCENDING);
```


---

# Data change listeners

Can be attached to `RealmObject` or `RealmResults`

```java
//After catching a squirtle

waterPkmn.addChangeListener(
  new RealmChangeListener<RealmResults<Pokemon>>() {
    @Override
    public void onChange(RealmResults<Pokemon> pkmn) {
      // Query results are updated in real time
      waterPkmn.size(); // => 2
    }
  }
);
```

^
when a change listener is called the object/result is automatically updated


---

![fit](http://i.imgur.com/gJmmNEO.jpg)

---
### Asynchronously using background thread

```java
realm.executeTransactionAsync(new Realm.Transaction() {
    @Override
    public void execute(Realm bgRealm) {
        Trainer brock = bgRealm.where(Trainer.class)
          .greaterThan("battlesWon", 3).findFirst();

        brock.setBattlesWon(4);
    }
}, new Realm.Transaction.OnSuccess() {
    @Override
    public void onSuccess() {
    	// Original queries and Realm objects are auto updated.
    	brock.getBattlesWon();   // => 4
    }
}, new Realm.Transaction.OnError() {
    @Override
    public void onError(Throwable error) {
      // Transaction failed and was automatically canceled.
    }
});
```

^
Can I ask about a realm objects relational objects?
Yes `trainer.getPokemon.get(0)`

---

### Prevent memory leaks

```java
    @Override
    protected void onDestroy() {

        // Remove the listener.
        realm.removeChangeListener(realmListener);
        //or realm.removeAllChangeListeners();

        // Close the Realm instance.
        realm.close();
        ...
    }
```

---

# Trainer Tips

- `@Ignore` will prevent property from saving to disk
- `RealmObjects` auto-update.
- `@PrimaryKey` allows the use of `copyToRealmOrUpdate()`
- Works with `Gson` and `Retrofit` easily
- Standalone mac app for browsing
- Now we can have custom getters and setters!


^
Objects never have to be refreshed. Changing objects is reflected immediately
Use `@Required` to make Realm disallow null values.
? What happens when you set or save a null property?


---

# Gotchas

- No support for list of `String` or primitives
  - In the meantime add this [Gson adapter](https://gist.github.com/cmelchior/1a97377df0c49cd4fca9)
- Need to save data to realm after getting response from `Retrofit`
- Large datasets or complex queries should be run on background thread

---

# Dart + Henson

Inspired by Butter Knife

Inject intent extras as a property on an object

---

![fit](https://i.ytimg.com/vi/BN1JKXPVxf0/maxresdefault.jpg)


---
# MMMBenefits

- stop wasting time and write less of this:
  - `intent.putExtra(EXTRA_POKEMON_ID, pokemonId);`
  - `pokemonId = getIntent().getStringExtra(EXTRA_POKEMON_ID);`
- readable DSL for passing extras to intent

---

```java
public class TradeActivity extends Activity {
  @InjectExtra long pokemonId;
  @Nullable @InjectExtra String itemName;
  //default value is true
  @InjectExtra boolean tradedFromFriend = true;
  //Trainer implements Parcelable
  @InjectExtra Trainer fromTrainer;

  @Override
  public void onCreate(Bundle bundle) {
    super.onCreate(bundle);
    Dart.inject(this);
    //TODO use member variables
    ...
  }
}
```

---

# Generate intent builders

```java
//Start intent for TradeActivity
Intent intent = Henson.with(context)
    .gotoTradeActivity()
    .pokemonId(133)
    .fromTrainer(new Trainer())
    .build();
// itemName is null
startActivity(intent);
```

^
Annotation processor
DSL offered by Henson
generated for all class that contain `@InjectExtra` fields
Thanks Daniel Reguera
https://medium.com/groupon-eng/better-android-intents-with-dart-henson-1ca91793944b#.h36j5sk5i


---

# Questions? Feedback?

- What did you learn?
- What didn't make sense?

@speaktochris
chguzman@groupon.com
http://bit.do/christalk
