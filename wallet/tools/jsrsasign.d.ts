declare namespace KJUR.crypto
{
    class Signature
    {
        constructor(value: any)
        initVerifyByPublicKey(value: any);
        updateString(value: any);
        verify(value: any): any;
        initSign(value: any);
        sign(): any
    }
}