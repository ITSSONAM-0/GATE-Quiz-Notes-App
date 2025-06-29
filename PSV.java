import java.util.Arrays;

class PSV {
    public static void main(string[] args)
    {
        int a[] = { 5,8,9,0,24};
        int small=9999;
        int t=0;
        for(int i=0; i<5;i++){
            for(int small=i+1; small<5; small++)
            {
                if (a[i]>a[small]){
                    t=a[i];
                    a[i]=a[small];
                    a[small]=t;
                }
            }
        }    }

    sort(a);
        for(int i=0; i<5;i++)
        {
            System.out.print (a[i]+"");
        }
}