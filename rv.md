# R-E-C-Y-C-L-E

![rocko](https://media.giphy.com/media/v7Fe79DNeXnz2/giphy.gif)

---


# What is a RecyclerView?

- A way to show a list of views or _items_ in your Android app
- Included in the support library
- Recycles views
  - _duh_

---

# So how does it work?

- Sets up a view if it's about to show up on screen
- _recycles_ view when it goes off the screen

---

![recycle](https://mzgreen.github.io/images/1/demo_gif.gif)

---

![wallace and gromit](http://i.imgur.com/567DHDu.gif)

---

# Examples of RVs in apps

---

# Vertical

![vertical](https://raw.githubusercontent.com/timusus/RecyclerView-FastScroll/master/screenshot.png)

---

# Horizontal

![horizontal](https://i.stack.imgur.com/Ez4ep.jpg)

---

# Grid

![grid](https://i.stack.imgur.com/2vKPc.jpg)

---

# Staggered Grid

![staggered grid](https://i.stack.imgur.com/oMlGz.png)

---

# Before the RecyclerView there was...

---

![land before RV](http://seveninchesofyourtime.com/wp-content/uploads/2014/03/landbeforetime.jpg)

---

# Was the ListView

![land before RV](http://seveninchesofyourtime.com/wp-content/uploads/2014/03/landbeforetime.jpg)

---

# Why RV

- more extensible
- can implement horizontal and vertical layouts
- ListViews were complicated to animate

---

# Three parts of the RV

- `LayoutManager`
  - Positions the items
- `RecyclerView.Adapter`
  - Handles data collection and binds to view
- `ItemAnimator`
  - Animates the removing, adding, or transforming of item

---

# `LayoutManager`

- `LinearLayoutManager`
  - vertical scrolling list
  - horizontal scrolling list
- `GridLayoutManager`
  - shows items in a uniform grid
- `StaggeredGridLayoutManager`
  - items can take up varying amount of space
  - Think pinterest or google keep

---

# `RecyclerView.Adapter`

- ViewHolder is required
- override two methods
  - one to inflate view and its viewholder
    - only called when  new view is created
    - Don't need to check if recycled
  - one to bind data to the view

---

# `ItemAnimator`

- Animates the `ViewGroup` when item is:
  - Added
  - Deleted
  - Selected
  - Transformed

---

# Add the RV

```groovy

#app/build.gradle
dependencies {
    ...
    compile 'com.android.support:support-v4:24.2.1'
    compile 'com.android.support:recyclerview-v7:24.2.1'
}
```

```xml
#res/layout/activity_main.xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent" >

    <android.support.v7.widget.RecyclerView
      android:id="@+id/rvContacts"
      android:layout_width="match_parent"
      android:layout_height="match_parent" />

</RelativeLayout>
```

---
# Custom Row Layout

```xml
#res/layout/item_contact.xml
<LinearLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:orientation="horizontal"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:paddingTop="10dp"
        android:paddingBottom="10dp"
        >

    <TextView
        android:id="@+id/contact_name"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"/>
</LinearLayout>

```

---

# Creating the `RecyclerView.Adapter`

---

```java
// Create the basic adapter extending from RecyclerView.Adapter
public class ContactsAdapter extends
    RecyclerView.Adapter<ContactsAdapter.ViewHolder> {

    // Provide a direct reference to each of the views within a data item
    public static class ViewHolder extends RecyclerView.ViewHolder {
        // Your holder should contain a member variable
        // for any view that will be set as you render a row
        public TextView nameTextView;

        // We also create a constructor that accepts the entire item row
        // and does the view lookups to find each subview
        public ViewHolder(View itemView) {
            // Stores the itemView in a public final member variable that can be used
            // to access the context from any ViewHolder instance.
            super(itemView);

            nameTextView = (TextView) itemView.findViewById(R.id.contact_name);
        }

        // Pass in the contact array into the constructor
        public ContactsAdapter(Context context, List<Contact> contacts) {
            mContacts = contacts;
            mContext = context;
        }
    }

    //To Be Continued...
```

---

```java
    // ... Continued from above

    // Usually involves inflating a layout from XML and returning the holder
    @Override
    public ContactsAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        Context context = parent.getContext();
        LayoutInflater inflater = LayoutInflater.from(context);

        // Inflate the custom layout
        View contactView = inflater.inflate(R.layout.item_contact, parent, false);

        // Return a new holder instance
        ViewHolder viewHolder = new ViewHolder(contactView);
        return viewHolder;
    }

    // Involves populating data into the item through holder
    @Override
    public void onBindViewHolder(ContactsAdapter.ViewHolder viewHolder, int position) {
        // Get the data model based on position
        Contact contact = mContacts.get(position);

        // Set item views based on your views and data model
        TextView textView = viewHolder.nameTextView;
        textView.setText(contact.getName());
    }

    // Returns the total count of items in the list
    @Override
    public int getItemCount() {
        return mContacts.size();
    }
}

```

---

# Add to Activity

```java
public class MainActivity extends AppCompatActivity {

     ArrayList<Contact> contacts;

     @Override
     protected void onCreate(Bundle savedInstanceState) {
         // ...
         // Lookup the recyclerview in activity layout
         RecyclerView rvContacts = (RecyclerView) findViewById(R.id.rvContacts);

         // Initialize contacts
         contacts = Contact.createContactsList(20);
         // Create adapter passing in the sample user data
         ContactsAdapter adapter = new ContactsAdapter(this, contacts);
         // Attach the adapter to the recyclerview to populate items
         rvContacts.setAdapter(adapter);
         // Set layout manager to position the items
         rvContacts.setLayoutManager(new LinearLayoutManager(this));
         // That's all!
     }
}

```

---

![finished](http://i.imgur.com/vbIL5HA.gif)


---

# Next steps

---
