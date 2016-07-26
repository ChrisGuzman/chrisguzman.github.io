autoscale: true

# Android Quick Start
### Libraries I wish I knew

^
less time on fragment in butter Knife
build narative for presentation
better transition to new library
too fast in realm
too many umms

---

# Chris Guzman
##  @speaktochris
### Engineer - Groupon

---

#[fit] Starting a new app?

#[fit] Not sure what libraries to use?

---

# A lot of apps do similar things

- Manage multiple views
- Load and display images
- Fetch data from an API
- Parse JSON
- Start new activities with extras
- Persist data to storage

---

# These libraries prevent you **reinventing the wheel** with every project.

- [Butter Knife](https://github.com/JakeWharton/butterknife) v8.2
- [Picasso](https://github.com/square/picasso) v2.5
- [Gson](https://github.com/google/gson) v2.7
- [Retrofit](https://github.com/square/retrofit) v2.1
- [Realm](https://realm.io/docs/java/latest/) v1.1
- [Dart & Henson](https://github.com/f2prateek/dart) v2.0

^
Write less code
Be more productive

---
# The 45 ~~Hour~~ Minute Hackathon

---

# What should I make?

---
# Introducing TTAaSTY
---
## Taco Techniques As a Service To You

---

# Step 1

## Set up our views

---

```xml
<ScrollView ...>

  <LinearLayout ... android:orientation="vertical">

    <TextView android:id="@+id/description" .../>

    <ImageView android:id="@+id/taco_img" .../>

    <LinearLayout android:orientation="horizontal" .../>

      <Button android:id="@+id/reject" .../>

      <Button android:id="@+id/save" .../>

    </LinearLayout>

    <EditText android:id="@+id/tags" .../>

  </LinearLayout>

</ScrollView>
```

---

# Step 2

## Use views

---

# **Butter Knife**
### Use annotations to write less boilerplate code

---

- How many times have you wrote findViewById?
- No additional cost at run-time - does not slow down your app at all!
- Improved View lookups
- Improved Listener attachments
- Improved Resource lookups



---

# Bind views in an activity

```xml
<TextView android:id="@+id/description"
    ...
    />

```

```java
public class MainActivity extends Activity {
    @BindView(R.id.description) TextView description;

    @Override
    protected void onCreate(Bundle bundle) {
        ...
        ButterKnife.bind(this);
        description.setText("Tofu with Cheese on a tortilla");
    }
}
```

---

# `ButterKnife.bind(this)`

Generates code that looks up views/resources and saves them as a property on the Activity.

```java
public void bind(MainActivity activity) {
  activity.description = (android.widget.TextView) activity.findViewById(2130968577);
}
```
---

#### Bind and unbind views in a fragment

```java
public class TacoFragment extends Fragment {
  @BindView(R.id.tags) EditText tags;

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup group, Bundle bundle) {
    ...
    ButterKnife.bind(this, parentView);
    //Important!
    unbinder = ButterKnife.bind(this, parentView);
    tags.setHint("Add tags. Eg: Tasty!, Want to try")
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
@OnClick(R.id.save)
public void saveTaco(Button button) {
  button.setText("Saved!");
}
```

### Arguments to the listener method are optional

```java
@OnClick(R.id.reject)
public void reject() {
  Log.d("RejectBtn", "onClick")
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
  @BindDrawable(R.drawable.star) Drawable star;
  // int or ColorStateList
  @BindColor(R.color.guac_green) int guacGreen;
  // int (in pixels) or float (for exact value)
  @BindDimen(R.dimen.spacer) Float spacer;
}
```

---

# Group views together:

```java
@OnClick({ R.id.save, R.id.reject})
public void actOnTaco(View view) {
  if (view.getId() == R.reject) {
    Toast.makeText(this, "Ew Gross!", LENGTH_SHORT).show();
  }
  else {
    Toast.makeText(this, "Yummy :)", LENGTH_SHORT).show();
  }
  //TODO: implement
  getNextTaco();
}
```

---


# Act on list of views at once with `ButterKnife.apply`.

```java
@BindViews({R.id.save, R.id.reject})
List<Button> actionButtons;

ButterKnife.apply(actionButtons, View.ALPHA, 0.0f);
```

---

## Action and Setter interfaces allow specifying simple behavior.

```java
ButterKnife.apply(actionButtons, DISABLE);
ButterKnife.apply(actionButtons, ENABLED, false);
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

----

```java
private void getNextTaco() {
  ButterKnife.apply(actionButtons, DISABLE);
  //TODO: implement
  setTacoImage();
}
```


---

# Step 3

## Add pictures of tasty tacos

---

# **Picasso**
## Download and display images with ease!

---

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
.placeholder(R.mipmap.loading) //can be a resource or a drawable
.error(R.drawable.sad_taco) //fallback image if error
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
Picasso.with(context).load(R.drawable.salsa).into(imageView1);
Picasso.with(context).load("file:///asset/salsa.png").into(imageView2);
Picasso.with(context).load(new File(...)).into(imageView3);
```

---


```java
//Butter Knife!
@BindView(R.id.taco_img) EditText tacoImg;

 private void setTacoImage() {
   Picasso.with(context)
           .load("http://tacoimages.com/random.jpg")
           .into(tacoImg);
 }
```

```java
private void getNextTaco() {
  ButterKnife.apply(actionButtons, DISABLE);
  setTacoImage();
  //TODO: implement
  loadTacoDescription();
}
```

---

![fit](http://images.roadtrafficsigns.com/img/lg/X/left-arrow-pedestrian-detour-sign-x-m4-9bl.png)

---

# Step 4
## Set up models

##### Get ready for models by setting up what JSON will look like

---

# Gson

## Convert JSON to a java object and vice versa!

---



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
class Taco {
  private String description;
  private String imageUrl;
  privte String tags;
  //not included in JSON serialization or deserialization
  private transient boolean favorite;
  Taco(String description, String imageUrl, String tags, boolean favorite) {
  ....
  }
}

// Serialize to JSON
Taco breakfastTaco = new Taco("Eggs with syrup on pancake", "imgur.com/123", "breakfast", true);
Gson gson = new Gson();
String json = gson.toJson(breakfastTaco);

// ==> json is {description:"Eggs with syrup on pancake", imageUrl:"imgur.com/123", tags:"breakfast"}

// Deserialize to POJO
Taco yummyTaco = gson.fromJson(json, Taco.class);
// ==> yummyTaco is just like breakfastTaco
```


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
//Set properties to null instead of ignoring them
Gson gson = new GsonBuilder().serializeNulls().create();
```


```java
//Keep whitespace
Gson gson = new GsonBuilder().setPrettyPrinting().create();
```

---

## Need to rename a variable from an API?

```java
public class Taco {

    @SerializedName("serialized_labels")
    private String tags;

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

![fit](http://images.huffingtonpost.com/2015-10-07-1444238550-4843540-detourend44178_640.png)

---

```java
private void getNextTaco() {
  ButterKnife.apply(actionButtons, DISABLE);
  setTacoImage();
  //TODO: implement
  loadTacoDescription();
}
```
---

# Step 5

## Get taco recipe from web API

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
public interface TacoApi {
    // Request method and URL specified in the annotation
    // Callback for the parsed response is the last parameter

    @GET("random/")
    Call<Taco> randomTaco(@Query("full-taco") boolean full);

    @GET("contributions/")
    Call<List<Contributor>> getContributors();

    @GET("contributions/{name}")
    Call<Contributor> getContributors(@Path("name") String username));

    @POST("recipe/new")
    Call<Recipe> createRecipe(@Body Recipe recipe);
}
```

---


#Getting JSON synchronously

```java

Retrofit retrofit = new Retrofit.Builder()
    .baseUrl("http://taco-randomizer.herokuapp.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build();

// Create an instance of our TacoApi interface.
TacoApi tacoApi = retrofit.create(TacoApi.class);

// Create a call instance for a random taco
Call<Taco> call = tacoApi.randomTaco(false);

// Fetch a random taco
// Do this off the main thread
Taco taco = call.execute().body();
```

---

# POSTing JSON Async

```java
Recipe recipe = new Recipe();
Call<Recipe> call = tacoApi.createRecipe(recipe);
call.enqueue(new Callback<Recipe>() {
  @Override
  public void onResponse(Call<Recipe> call, Response<Recipe> response) {

  }

  @Override
  public void onFailure(Call<Recipe> call, Throwable t) {

  }
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
@POST("http://taco-randomizer.herokuapp.com/v2/taco")
private Call<Taco> getFromNewAPI();
```

```java
//Add headers
@Headers({"User-Agent: tacobot"})
@GET("contributions/")
private Call<List<Contributor>> getContributors();
```

---

```java
private void getNextTaco() {
  ...
  loadTacoDescription();
}

private void loadTacoDescription() {
  Call<Taco> call = tacoApi.randomTaco(false);
  call.enqueue(new Callback<Taco>() {
    @Override
    public void onResponse(Call<Taco> call, Response<Taco> response) {
      //Set description from response
      Taco taco = response.body;
      //TODO: implement
      saveTaco(taco);
    }

    @Override
    public void onFailure(Call<Taco> call, Throwable t) {
      //Show error
    }
}
```

---

# Save taco recipe for later!

---

# Realm

## Replacement for sqlite

---


- Works by extending your models
- Made for mobile
- Most queries in Realm are fast enough to be run synchronously
- Can have multiple realm database in an app

---


```java
public class Taco extends RealmObject {
  private String description;
  private String tags;
  private String imageUrl;
  private boolean favorite;
  //getters and setters
}
```

^
Primary key can be String or byte, short, int, long
Don't have to use getters/setters can be public attributes


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
# Persist to db

```java
// Persist your data in a transaction
realm.beginTransaction();

// Persist unmanaged objects
final Taco managedTaco = realm.copyToRealm(unmanagedTaco);

// Create managed objects directly
Taco taco = realm.createObject(Taco.class);

realm.commitTransaction();
```

^
Bad to do on main thread? - No it's fast enough

---

# Accessing Data


```java
//find all favorite tacos
final RealmResults<Taco> likedTacos =
 realm.where(Taco.class).equalTo("favorite", true).findAll();
```

---

# Writing data

---

```java
//Transaction block
realm.executeTransaction(new Realm.Transaction() {
  @Override
  public void execute(Realm realm) {
    Taco taco = realm.createObject(Taco.class);
    taco.setDescription("Spaghetti Squash on Fresh Corn Tortillas");
    user.setImageUrl("http://tacoimages.com/1.jpg");
  }
});
```

---

```java
//Async
realm.executeTransactionAsync(new Realm.Transaction() {
            @Override
            public void execute(Realm bgRealm) {
                Taco taco = bgRealm.createObject(Taco.class);
                taco.setDescription("Spaghetti Squash on Fresh Corn Tortillas");
                user.setImageUrl("http://tacoimages.com/1.jpg");
            }
        }, new Realm.Transaction.OnSuccess() {
            @Override
            public void onSuccess() {
                // Transaction was a success.
            }
        }, new Realm.Transaction.OnError() {
            @Override
            public void onError(Throwable error) {
                // Transaction failed and was automatically canceled.
            }
        });
```

---

# Fact:

## Tacos have many ingredients

---

```java
public class Taco extends RealmObject {
  ...
  private List<Ingredient>
  ...
}

public class Ingredient extends RealmObject {
  private String name;
  private URL url;
}
```

---

```java
RealmResults<Taco> limeTacos = realm.where(Taco.class)
                                .equalTo("ingredients.name", "Lime")
                                .findAll();
```

---
# Typical SQL relationships

- One to One
- One to Many
- Many to One
- Many to Many


---

# Conditions

- `between()`
- `greaterThan()`, `lessThan()`
- `greaterThanOrEqualTo()` & `lessThanOrEqualTo()`
- `equalTo()` & `notEqualTo()`
- `contains()`
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
        limeTacos.deleteFirstFromRealm();
        //or limeTacos.deleteLastFromRealm();

        // remove a single object
        Taco fishTaco = limeTacos.get(1);
        fishTaco.deleteFromRealm();

        // Delete all matches
        limeTacos.deleteAllFromRealm();
    }
});
```

---

# Data change listeners

### Can be attached to `RealmObject` or `RealmResults`

```java
limeTacos.addChangeListener(
  new RealmChangeListener<RealmResults<Taco>>() {
    @Override
    public void onChange(RealmResults<Taco> tacosConLimon) {
      //tacosConLimon.size() == limeTacos.size()

      // Query results are updated in real time
      Log.d("LimeTacos", "Now we have" + limeTacos.size() + " tacos");
    }
  }
);
```

^
when a change listener is called the object/result is automatically updated

---

# Tips

- `@PrimaryKey` allows the use of `copyToRealmOrUpdate()`
- Works with `Gson` and `Retrofit` easily
- Now we can have custom getters and setters!


^
Objects never have to be refreshed. Changing objects is reflected immediately
Use `@Required` to make Realm disallow null values.
? What happens when you set or save a null property?

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

# Gotchas

- No support for list of `String` or primitives
  - In the meantime add this [Gson adapter](https://gist.github.com/cmelchior/1a97377df0c49cd4fca9)
- Need to save data to realm after getting response from `Retrofit`
- Large datasets or complex queries should be run on background thread

---

```java
//TODO: implement
goToTacoListActivity();
```

---

# Dart + Henson

Inspired by Butter Knife

Inject intent extras as a property on an object

---
# Benefits

- stop wasting time and write less of this:
  - `intent.putExtra(EXTRA_TACOS_SAVED, true);`
  - `pokemonId = getIntent().getExtras().getBoolean(EXTRA_TACOS_SAVED);
- readable DSL for passing extras to intent

---

```java
public class TacoListActivity extends Activity {
  @InjectExtra boolean saved;
  //default value if left null
  @Nullable @InjectExtra String withTag = "taco";
  //Ingredient implements Parcelable
  @Nullable @InjectExtra Ingredient withIngredient;

  @Override
  public void onCreate(Bundle bundle) {
    super.onCreate(bundle);
    Dart.inject(this);
    //TODO use member variables
    ...
  }
}
```

^
What if default injection is null?

---

# Generate intent builders

```java
//Start intent for TacoListActivity
Intent intent = Henson.with(context)
    .gotoTacoListActivity()
    .saved(true)
    .withIngredient(new Ingredient())
    .build();
// tag is null
startActivity(intent);
```

^
Annotation processor
DSL offered by Henson
generated for all class that contain `@InjectExtra` fields
Thanks Daniel Reguera
https://medium.com/groupon-eng/better-android-intents-with-dart-henson-1ca91793944b#.h36j5sk5i

---

# Want to use Henson for an activity without injectable extras?

Annotate the activity with `@HensonNavigable`

---

# Is that it?

---

```bash
grep 'TODO: implement'
=> 0 results
```

---

- [Butter Knife](https://github.com/JakeWharton/butterknife) - Manage multiple views
- [Picasso](https://github.com/square/picasso) - Load and display images
- [Gson](https://github.com/google/gson) - Parse JSON
- [Retrofit](https://github.com/square/retrofit) - Fetch data from an API
- [Realm](https://realm.io/docs/java/latest/) - Persist data to storage
- [Dart & Henson](https://github.com/f2prateek/dart) - Start new activities with extras

---

# Questions?

- What did you learn?
- What didn't make sense?

@speaktochris
chguzman@groupon.com
http://bit.do/christalk
